interface Ghost {
    evidences: string[];
    extra?: string[]; // Hacer la propiedad 'extra' opcional
}

interface Ghosts {
    [nombre: string]: Ghost;
}

document.addEventListener('DOMContentLoaded', () => {
    const ghostForm = document.getElementById('ghostForm') as HTMLFormElement;
    const ghostList = document.getElementById('ghostList') as HTMLDivElement;

    fetch('ghosts.json?hgfd')
        .then(response => response.json())
        .then((data: { ghosts: Ghosts }) => {
            // Generar checkboxes desde las evidences disponibles en el JSON
            const availableEvidences = new Set<string>();
            console.log(data);
            Object.values(data.ghosts).forEach(ghost => {
                ghost.evidences.forEach(prueba => availableEvidences.add(prueba));
                if (ghost.extra) {
                    ghost.extra.forEach(prueba => availableEvidences.add(prueba));
                }
            });

            availableEvidences.forEach(evidenceName => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = evidenceName;
                checkbox.addEventListener('change', actualizarListado);

                const label = document.createElement('label');
                label.classList.add('mr-2');
                label.classList.add('inline-block');
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${evidenceName}`));

                ghostForm.appendChild(label);
                const hr = document.createElement('hr');
                ghostList.appendChild(hr);

            });

            // Mostrar todos los fantasmas inicialmente
            ghostList.innerHTML = generarListado([], data.ghosts);

            function actualizarListado() {
                const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
                const selectedTests: string[] = [];

                checkboxes.forEach((checkbox) => {
                    if (checkbox.checked) {
                        selectedTests.push(checkbox.name);
                    }
                });

                ghostList.innerHTML = generarListado(selectedTests, data.ghosts);
            }

            function generarListado(selectedTests: string[], ghosts: Ghosts): string {
                const resultado: string[] = [];

                for (const [nombreFantasma, datosFantasma] of Object.entries(ghosts)) {
                    const evidencesFantasma = datosFantasma.evidences;
                    const extraEvidencesFantasma = datosFantasma.extra || []; // Manejar el caso en que 'extra' pueda ser undefined

                    const todasEvidencias = [...evidencesFantasma, ...extraEvidencesFantasma]; // Concatenar las evidencias y las extra

                    const fantasmaVisible = selectedTests.every(test => todasEvidencias.includes(test));

                    resultado.push(`<label class="mr-2 inline-block" style="text-decoration: ${fantasmaVisible ? 'none' : 'line-through;'};color: ${fantasmaVisible ? 'none' : 'red;'} ">${nombreFantasma}</label>`);
                }

                if (resultado.length === 0) {
                    return "No hay resultados.";
                }

                return resultado.join('');
            }
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
