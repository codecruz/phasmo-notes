interface Fantasma {
    pruebas: string[];
}

interface Fantasmas {
    [nombre: string]: Fantasma;
}

document.addEventListener('DOMContentLoaded', () => {
    const ghostForm = document.getElementById('ghostForm') as HTMLFormElement;
    const listadoFantasmas = document.getElementById('listadoFantasmas') as HTMLDivElement;

    fetch('fantasmas.json')
        .then(response => response.json())
        .then((data: { fantasmas: Fantasmas }) => {
            // Generar checkboxes desde las pruebas disponibles en el JSON
            const pruebasDisponibles = new Set<string>();
            Object.values(data.fantasmas).forEach(fantasma => {
                fantasma.pruebas.forEach(prueba => pruebasDisponibles.add(prueba));
            });

            pruebasDisponibles.forEach(nombrePrueba => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = nombrePrueba;
                checkbox.addEventListener('change', actualizarListado);

                const label = document.createElement('label');
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${nombrePrueba}`));

                ghostForm.appendChild(label);
            });

            // Mostrar todos los fantasmas inicialmente
            listadoFantasmas.innerHTML = generarListado([], data.fantasmas);

            function actualizarListado() {
                const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
                const selectedTests: string[] = [];

                checkboxes.forEach((checkbox) => {
                    if (checkbox.checked) {
                        selectedTests.push(checkbox.name);
                    }
                });

                listadoFantasmas.innerHTML = generarListado(selectedTests, data.fantasmas);
            }

            function generarListado(selectedTests: string[], fantasmas: Fantasmas): string {
                const resultado: string[] = [];

                for (const [nombreFantasma, datosFantasma] of Object.entries(fantasmas)) {
                    const pruebasFantasma = datosFantasma.pruebas;

                    const fantasmaVisible = selectedTests.every(test => pruebasFantasma.includes(test));

                    resultado.push(`<p style="text-decoration: ${fantasmaVisible ? 'none' : 'line-through;'}">${nombreFantasma}</p>`);
                }

                if (resultado.length === 0) {
                    return "No hay resultados.";
                }

                return resultado.join('');
            }
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
