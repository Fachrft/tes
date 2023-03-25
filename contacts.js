const { dir } = require('node:console');
const fs = require('node:fs');
const chalk = require('chalk');
const validator = require('validator');

// membuat folder
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const loadContact = () => {
  const file = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(file);
  return contacts;
};

const simpanContact = (nama, email, nomor) => {
  const db = { nama, email, nomor };
  loadContact();

  // duplikat
  const duplikat = loadContact().find((db) => db.nama === nama);
  if (duplikat) {
    console.log(chalk.red.inverse.bold('nama anda sudah terpakai silahkan gunakan nama lain'));
    return false;
  }

  // cek email
  if (email) {
    if (!validator.isEmail(email)) {
      console.log(chalk.red.inverse.bold('email tidak valid'));
      return false;
    }
  }

  if (!validator.isMobilePhone(nomor, 'id-ID')) {
    console.log(chalk.red.inverse.bold('nomor tidak valid'));
    return false;
  }

  loadContact().push(db);

  fs.writeFileSync('data/contacts.json', JSON.stringify(loadContact()));

  console.log(chalk.blue.inverse.bold('terimakasih sudah mendaftar'));
};

// menampilkan list contact
const listContact = () => {
  const contacts = loadContact();
  console.log(chalk.green.inverse.bold('daftar contact : '));
  contacts.forEach((contact, i) => {
    console.log(`${i + 1}. ${contact.nama} - ${contact.nomor}`);
  });
};

// menammpilkan detail contact menggunakan nama
const detailContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());

  if (!contact) {
    console.log(chalk.red.inverse.bold(`${nama} tidak ada di daftar`));
    return false;
  }

  console.log(chalk.cyan.inverse.bold(contact.nama));
  console.log(contact.nomor);

  if (contact.email) {
    console.log(contact.email);
  }
};

// menghapus data beradasarkan nama
const deleteContact = (nama) => {
  const contacts = loadContact();
  const newContact = contacts.filter((contact) => contact.nama.toLowerCase() !== nama.toLowerCase());

  if (contacts.length === newContact.length) {
    console.log(chalk.red.inverse.bold(`${nama} tidak ada di daftar`));
    return false;
  }

  fs.writeFileSync('data/contacts.json', JSON.stringify(newContact));
  console.log(chalk.blue.inverse.bold(`data contact ${nama} berhasil di hapus`));
};

module.exports = { simpanContact, listContact, detailContact, deleteContact };
