/*import fs from "fs";


routers.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        // Læs filen
        const data = fs.readFileSync('./JsonModeller/users.json');
        let users = JSON.parse(data);

        // LOGIK: Find brugeren for at se om han findes (valgfrit, men god skik)
        const userExists = users.find(user => user.id == userId);
        if (!userExists) {
            return res.status(404).json({ message: 'Bruger ikke fundet' });
        }

        // LOGIK: Lav en ny liste, der indeholder alle UNDTAGEN den vi sletter
        const newUsersList = users.filter(user => user.id != userId);

        // Skriv den nye liste tilbage til filen
        fs.writeFileSync('./JsonModeller/users.json', JSON.stringify(newUsersList, null, 2));

        // Send succes-svar tilbage
        res.status(200).json({ message: 'Bruger slettet succesfuldt' });

    } catch (error) {
        console.error(error); // Så du kan se fejlen i din server-terminal
        res.status(500).json({ message: 'Bruger kunne ikke slettes' });
    }
}); */