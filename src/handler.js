const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (req, h) => {
  if (req.query.reading) {
    if (req.query.reading === '0') {
      const readBook = books.filter((book) => book.reading === false);
      const result = readBook.map((book) => {
        const container = {};
        container.id = book.id;
        container.name = book.name;
        container.publisher = book.publisher;
        return container;
      });
      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });
      response.code(200);
      return response;
    }
    if (req.query.reading === '1') {
      const readBook = books.filter((book) => book.reading === true);
      const result = readBook.map((book) => {
        const container = {};
        container.id = book.id;
        container.name = book.name;
        container.publisher = book.publisher;
        return container;
      });
      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });
      response.code(200);
      return response;
    }
  } else if (req.query.name) {
    const name = req.query.name.toLowerCase();
    const nameBook = books.filter((book) => book.name.toLowerCase().includes(name));

    const result = nameBook.map((book) => {
      const container = {};
      container.id = book.id;
      container.name = book.name;
      container.publisher = book.publisher;
      return container;
    });
    const response = h.response({
      status: 'success',
      data: {
        books: result,
      },
    });
    response.code(200);
    return response;
  } else if (req.query.finished) {
    if (req.query.finished === '0') {
      const finishedBook = books.filter((book) => book.finished === false);
      const result = finishedBook.map((book) => {
        const container = {};
        container.id = book.id;
        container.name = book.name;
        container.publisher = book.publisher;
        return container;
      });
      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });
      response.code(200);
      return response;
    }
    if (req.query.finished === '1') {
      const finishedBook = books.filter((book) => book.finished === true);
      const result = finishedBook.map((book) => {
        const container = {};
        container.id = book.id;
        container.name = book.name;
        container.publisher = book.publisher;
        return container;
      });
      const response = h.response({
        status: 'success',
        data: {
          books: result,
        },
      });
      response.code(200);
      return response;
    }
  }
  const result = books.map((book) => {
    const container = {};
    container.id = book.id;
    container.name = book.name;
    container.publisher = book.publisher;

    return container;
  });

  const response = h.response({
    status: 'success',
    data: {
      books: result,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const book = books.filter((n) => n.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
