import { getEquipos, updateEquipo, addPiloto } from '../../api/fetchApi.js';

class RacerCreateComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/`
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <div class="container p-3">
                <h2>Crear Piloto de F1</h2>
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input type="text" id="name" class="form-control" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Equipo</label>
                    <select id="team" class="form-select"></select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Rol</label>
                    <select id="role" class="form-select">
                        <option value="Lider">Líder</option>
                        <option value="Escudero">Escudero</option>
                    </select>
                </div>
                <button id="create-racer" class="btn btn-primary">Crear Piloto</button>
            </div>
        `;
    }

    async connectedCallback() {
        await this.loadTeams();
        this.shadowRoot.querySelector('#create-racer').addEventListener('click', () => this.createRacer());
    }

    async loadTeams() {
        const teams = await getEquipos();
        const select = this.shadowRoot.querySelector('#team');
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.nombre;
            select.appendChild(option);
        });
    }

    async createRacer() {
        const name = this.shadowRoot.querySelector('#name').value;
        const teamId = this.shadowRoot.querySelector('#team').value;
        const role = this.shadowRoot.querySelector('#role').value;

        const response = await fetch(`${API_URL}/pilotos`);
        const pilots = await response.json();
        const lastId = pilots.length > 0 ? pilots[pilots.length - 1].id : 0;
        const newId = (parseInt(lastId) + 1).toString();

        const newPilot = { id: newId, nombre: name, equipo: teamId, rol: role };
        await addPiloto(newPilot);

        const teamResponse = await fetch(`${API_URL}/equipos/${teamId}`);
        const team = await teamResponse.json();
        team.pilotos = team.pilotos ? [...team.pilotos, newId] : [newId];
        await updateEquipo(teamId, { pilotos: team.pilotos });
    }
}

customElements.define('racer-create-component', RacerCreateComponent);
