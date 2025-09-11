const contactsList = {};

let persons = [
  {
    "name": "Lala Kufmenk",
    "email": "lala.kufmenk@yahoo.de",
    "password": "123Test",
    "initials": "LK",
    "color": "#a3d25f",
    "role": "user"
  },
  {
    "name": "Tom Schneider",
    "email": "tom.schneider@mail.de",
    "password": "Passwort123",
    "initials": "TS",
    "color": "#f28b82",
    "role": "user"
  },
  {
    "name": "Mira Klein",
    "email": "mira.klein@web.de",
    "password": "Sicher456!",
    "initials": "MK",
    "color": "#aecbfa",
    "role": "user"
  },
  {
    "name": "Jonas Reuter",
    "email": "jonas.reuter@gmx.de",
    "password": "Jonas789#",
    "initials": "JR",
    "color": "#ccff90",
    "role": "user"
  },
  {
    "name": "Elif Demir",
    "email": "elif.demir@t-online.de",
    "password": "EDpass321",
    "initials": "ED",
    "color": "#ffd6a5",
    "role": "user"
  },
  {
    "name": "Mira Klein",
    "email": "mira.klein@web.de",
    "password": "Sicher456!",
    "initials": "MK",
    "color": "#aecbfa",
    "role": "user"
  },
  {
    "name": "Jonas Reuter",
    "email": "jonas.reuter@gmx.de",
    "password": "Jonas789#",
    "initials": "JR",
    "color": "#ccff90",
    "role": "user"
  },
  {
    "name": "Elif Demir",
    "email": "elif.demir@t-online.de",
    "password": "EDpass321",
    "initials": "ED",
    "color": "#ffd6a5",
    "role": "user"
  }
];


// TODO: Auslagern der Funktion... sollte hier nicht stehen
async function loadContacts() {
    try {
        // Cache-Bypass durch Timestamp
        const response = await fetch(`https://join-476d1-default-rtdb.firebaseio.com/contacts/data.json?t=${Date.now()}`);

        if (!response.ok) {
        throw new Error("Failed to load contacts");
        }

        persons = await response.json();

    } catch (error) {
        console.error("Error loading contacts:", error);
    }
}

// TODO: Auslagern der Funktion... sollte hier nicht stehen
function generateInitials(name) {
    if (!name || typeof name !== 'string') return '';
    
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
}