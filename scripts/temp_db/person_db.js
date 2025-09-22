
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
}


function generateInitials(name) {
    if (!name || typeof name !== 'string') return '';
    
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
}