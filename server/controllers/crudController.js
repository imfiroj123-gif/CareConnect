// ============================================================
// server/controllers/crudController.js
// A small reusable CRUD controller factory.
// Every resource (patients, doctors, appointments...) gets the
// same REST behaviour without duplicating code.
//
// It operates directly on an in-memory JavaScript array —
// there is NO database anywhere in this project.
// ============================================================

/**
 * Creates a set of Express route handlers for one resource.
 * @param {Array}  items    The in-memory array acting as "storage"
 * @param {string} idPrefix Prefix used when generating new ids (e.g. 'P')
 */
function createCrudController(items, idPrefix) {
  let nextNumber = 1000 + items.length + 1;

  // Generate the next id like P-1012 / D-209 / A-3009 ...
  function generateId() {
    const id = `${idPrefix}-${nextNumber}`;
    nextNumber += 1;
    return id;
  }

  return {
    // GET /api/<resource>
    getAll(req, res) {
      res.json(items);
    },

    // GET /api/<resource>/:id
    getOne(req, res) {
      const item = items.find((i) => i.id === req.params.id);
      if (!item) return res.status(404).json({ message: 'Record not found' });
      res.json(item);
    },

    // POST /api/<resource>
    create(req, res) {
      const record = { ...req.body };
      if (!record.id) record.id = generateId();
      if (!record.createdAt) record.createdAt = new Date().toISOString();
      items.unshift(record); // newest first for nicer demo lists
      res.status(201).json(record);
    },

    // PUT /api/<resource>/:id
    update(req, res) {
      const index = items.findIndex((i) => i.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Record not found' });
      items[index] = { ...items[index], ...req.body, id: items[index].id };
      res.json(items[index]);
    },

    // DELETE /api/<resource>/:id
    remove(req, res) {
      const index = items.findIndex((i) => i.id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Record not found' });
      const removed = items.splice(index, 1)[0];
      res.json({ message: 'Deleted', deleted: removed });
    },
  };
}

module.exports = { createCrudController };
