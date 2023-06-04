// IMPORTS
import Note from "../models/Note.js";
import User from "../models/User.js";

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    // GET DATA
    const notes = await Note.find().lean();
    // CONFIRM DATA
    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found" });
    }
    // FIND USERNAME FOR EACH NOTES
    const notesWithUsername = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, username: user.username };
    }));
    // SEND DATA
    res.status(200).json(notesWithUsername);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    // GET DATA
    const { user, title, text } = req.body;
    // CONFIRM DATA
    if (!user || !title || !text) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // DUPLICATE DATA
    const duplicate = await Note.findOne({ title: title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate title" });
    }
    // CREATE DATA
    const newNote = new Note({ user: user, title: title, text: text });
    const result = await newNote.save();
    // SEND DATA
    if (result) {
        return res.status(201).json({ message: `Note ${result.title} created :)` });
    }
    else {
        return res.status(400).json({ message: "Creation failed :(" });
    }
});

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    // GET DATA
    const { id, user, title, text, completed } = req.body;
    // CONFIRM DATA
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({ message: "All fields are required, except password" });
    }
    // FIND DATA
    const note = Note.findById(id).exec();
    if (!note) {
        return res.status(404).send({ message: "Note does not exist" });
    }
    // DUPLICATE DATA
    const duplicate = Note.findOne({ title: title }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate title" });
    }
    // CREATE DATA
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    // SEND DATA
    const updatedNote = await note.save()
    res.status(200).json({ message: `${updatedNote.title} updated` });
});

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    // GET DATA
    const { id } = req.body;
    // CONFIRM DATA
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' });
    }
    // FIND DATA
    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }
    // DELETE & SEND RESULT
    const result = await Note.deleteOne();
    res.status(200).json({ message: `Note ${result.title} with ID ${result._id} deleted` });
});

export { getAllNotes, createNewNote, updateNote, deleteNote };