// 共享白板数据层
// local 模式：单机 localStorage（断网/未配置时的兜底）
// supabase 模式：匿名登录 + RLS，所有人实时共享同一块白板。
//   - 每个访客首次访问自动匿名登录，uid 即身份（owner）
//   - 服务端 RLS 强制：只能改/删自己的东西；管理员（wb_admins 表）全权
//   - 投票单独存 wb_votes（一人一票），否则访客无法给别人的投票卡计票

import { createClient } from '@supabase/supabase-js';

export const ESTHER_OWNER = 'kael'; // local 模式的管理员 token
export const TOKEN_KEY = 'wb.myToken';
export const CARDS_KEY = 'wb.cards.v2';

export const WB_CONFIG = {
  MODE: 'local', // 'local' | 'supabase'（heim 移植版默认本地：不写上游作者的 Supabase）
  SUPABASE_URL: 'https://fnnyaroicflzmjuvtemc.supabase.co',
  SUPABASE_ANON_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubnlhcm9pY2Zsem1qdXZ0ZW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NDY1ODcsImV4cCI6MjEwMzEyMjU4N30.Eb4hdlu_5Y5ig42kaKGPgGBRrrdYhzXmIJtDIdNTGZA',
  TABLE: 'wb_cards',
  VOTES_TABLE: 'wb_votes',
  ADMINS_TABLE: 'wb_admins',
};

export function supabaseReady() {
  return (
    WB_CONFIG.MODE === 'supabase' &&
    !!WB_CONFIG.SUPABASE_URL &&
    !!WB_CONFIG.SUPABASE_ANON_KEY
  );
}

// ---------- local 模式 ----------

export function getMyToken() {
  // local 模式管理员激活：访问 whiteboard.html?admin=esther
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get('admin') === ESTHER_OWNER) {
      localStorage.setItem(TOKEN_KEY, ESTHER_OWNER);
    }
  } catch {
    /* ignore */
  }
  let token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY, token);
  }
  return token;
}

export function isAdmin(token) {
  return token === ESTHER_OWNER;
}

export function loadLocalCards() {
  try {
    return JSON.parse(localStorage.getItem(CARDS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveLocalCards(cards) {
  try {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  } catch {
    /* ignore quota */
  }
}

// ---------- supabase 模式 ----------

let sb = null;
export function getSb() {
  if (!sb) sb = createClient(WB_CONFIG.SUPABASE_URL, WB_CONFIG.SUPABASE_ANON_KEY);
  return sb;
}

// 匿名登录（首次访问自动注册一个匿名身份，会话存在 localStorage，刷新不变）
export async function initRemoteAuth() {
  const client = getSb();
  const {
    data: { session },
  } = await client.auth.getSession();
  if (session?.user) return session.user.id;
  const { data, error } = await client.auth.signInAnonymously();
  if (error) throw error;
  const uid = data.user?.id;
  if (!uid) throw new Error('anonymous sign-in returned no user');
  return uid;
}

export async function fetchAdmins() {
  const { data, error } = await getSb().from(WB_CONFIG.ADMINS_TABLE).select('uid');
  if (error) throw error;
  return (data || []).map((r) => r.uid);
}

// 整张卡片对象存进 data jsonb；id/owner 以列为准
const rowToCard = (row) => ({ ...row.data, id: row.id, owner: row.owner });
const cardToRow = (card) => ({ id: card.id, owner: card.owner, data: card });

export async function fetchCards() {
  const { data, error } = await getSb()
    .from(WB_CONFIG.TABLE)
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(rowToCard);
}

export async function insertCardRemote(card) {
  markLocalWrite(card.id);
  const { error } = await getSb().from(WB_CONFIG.TABLE).insert(cardToRow(card));
  if (error) throw error;
}

export async function updateCardRemote(card) {
  markLocalWrite(card.id);
  const { error } = await getSb()
    .from(WB_CONFIG.TABLE)
    .update({ data: card })
    .eq('id', card.id);
  if (error) throw error;
}

export async function deleteCardRemote(id) {
  markLocalWrite(id);
  const { error } = await getSb().from(WB_CONFIG.TABLE).delete().eq('id', id);
  if (error) throw error;
}

// 拖拽等高频更新：防抖写入；getLatest 用于在触发时取最新快照，避免覆盖期间的编辑
const pendingWrites = new Map(); // id -> timer
export function syncCardDebounced(card, delay = 600, getLatest) {
  markLocalWrite(card.id);
  const t = pendingWrites.get(card.id);
  if (t) clearTimeout(t);
  pendingWrites.set(
    card.id,
    setTimeout(() => {
      pendingWrites.delete(card.id);
      const latest = getLatest?.(card.id) || card;
      updateCardRemote(latest).catch((e) => console.warn('sync card failed', e));
    }, delay)
  );
}

// 自己写入的实时回广播：忽略，避免拖拽中被自己的回声拽回
const localWriteTs = new Map();
export function markLocalWrite(id) {
  localWriteTs.set(id, Date.now());
}
export function isOwnEcho(id, ms = 2000) {
  return Date.now() - (localWriteTs.get(id) || 0) < ms;
}

// ---------- 投票（一人一票，可改可取消） ----------

export async function fetchVotes() {
  const { data, error } = await getSb().from(WB_CONFIG.VOTES_TABLE).select('*');
  if (error) throw error;
  return data || [];
}

export async function upsertVoteRemote(cardId, voter, optionIndex) {
  const { error } = await getSb()
    .from(WB_CONFIG.VOTES_TABLE)
    .upsert(
      { card_id: cardId, voter, option_index: optionIndex },
      { onConflict: 'card_id,voter' }
    );
  if (error) throw error;
}

export async function deleteVoteRemote(cardId, voter) {
  const { error } = await getSb()
    .from(WB_CONFIG.VOTES_TABLE)
    .delete()
    .eq('card_id', cardId)
    .eq('voter', voter);
  if (error) throw error;
}

// 把 wb_votes 的行合并进投票卡的 options[].votes（供现有 VoteCard 渲染）
export function mergeVotes(cards, voteRows) {
  const byCard = {};
  for (const v of voteRows) (byCard[v.card_id] ||= []).push(v);
  return cards.map((c) => {
    if (c.tpl !== 'vote') return c;
    const rows = byCard[c.id] || [];
    const options = (c.data?.options || []).map((op, i) => ({
      ...op,
      votes: rows.filter((r) => r.option_index === i).map((r) => r.voter),
    }));
    return { ...c, data: { ...c.data, options } };
  });
}

// ---------- 实时订阅 ----------

export function subscribeRemote(handlers) {
  const client = getSb();
  const ch = client
    .channel('wb-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: WB_CONFIG.TABLE },
      (p) => handlers.onCard?.(p)
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: WB_CONFIG.VOTES_TABLE },
      (p) => handlers.onVote?.(p)
    )
    .subscribe();
  return () => {
    client.removeChannel(ch);
  };
}
