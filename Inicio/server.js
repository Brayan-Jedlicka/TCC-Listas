app.post('/api/lists', auth, (req, res) => {
  const { title, type } = req.body || {};
  if (!title) return res.status(400).json({ error: 'missing_title' });
  const data = loadData();
  data[req.user.email] = data[req.user.email] || { lists: [], passwordHash: '' };
  const newList = { id: Date.now().toString(), title, items: [], type: type || 'generic' };
  data[req.user.email].lists.push(newList);
  saveData(data);
  return res.json({ list: newList });
});

app.post('/api/lists/:id/items', auth, (req, res) => {
  const id = req.params.id;
  const { item } = req.body || {};
  if (item === undefined) return res.status(400).json({ error: 'missing_item' });
  const data = loadData();
  data[req.user.email] = data[req.user.email] || { lists: [], passwordHash: '' };
  const user = data[req.user.email];
  const list = (user.lists || []).find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'not_found' });
  list.items = list.items || [];
  list.items.push(item);
  saveData(data);
  return res.json({ ok: true, items: list.items });
});

app.put('/api/lists/:id/items/:idx', auth, (req, res) => {
  const id = req.params.id;
  const idx = Number(req.params.idx);
  const { item } = req.body || {};
  if (item === undefined) return res.status(400).json({ error: 'missing_item' });
  const data = loadData();
  const user = data[req.user.email];
  if (!user) return res.status(404).json({ error: 'not_found' });
  const list = (user.lists || []).find(l => l.id === id);
  if (!list) return res.status(404).json({ error: 'not_found' });
  list.items = list.items || [];
  if (isNaN(idx) || idx < 0 || idx >= list.items.length) return res.status(400).json({ error: 'invalid_index' });
  list.items[idx] = item;
  saveData(data);
  return res.json({ ok: true, items: list.items });
});