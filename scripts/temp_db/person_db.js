
async function getContacts() {
    try {
        const response = await fetch(`https://join-476d1-default-rtdb.firebaseio.com/contacts/data.json?t=${Date.now()}`);

        if (!response.ok) {
            throw new Error("Failed to load contacts");
        }

        return await response.json();

    } catch (error) {
        console.error("Error loading contacts:", error);
    }
    return null;
}
