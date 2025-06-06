import { getEquipos, updateEquipo } from '../../api/fetchApi.js';

class EditTeamComponent extends HTMLElement {
    constructor() {
        super();
        this.equipos = [];
        this.selectedEquipo = null;
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = /*html*/ `
        <style>
            @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');
        </style>
        <div class="container mt-4">
            <h3 class="mb-3">Edit Team</h3>
            <select class="form-select mb-3" id="team-select"></select>
            <form class="border p-3" id="edit-form" style="display: none;">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input class="form-control" type="text" id="nombre" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Country</label>
                    <input class="form-control" type="text" id="pais" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Engine</label>
                    <input class="form-control" type="text" id="motor" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Image URL</label>
                    <input class="form-control" type="url" id="imagen" required>
                </div>
                <button class="btn btn-primary" type="submit">Update</button>
                <div id="confirmation-message" class="alert alert-success mt-3" style="display: none;">
                    Team updated successfully!
                </div>
            </form>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js" crossorigin="anonymous"></script>
        `;
    }

    async connectedCallback() {
        await this.fetchEquipos();
        this.shadowRoot.querySelector('#team-select').addEventListener('change', (e) => this.handleSelectChange(e));
        this.shadowRoot.querySelector('#edit-form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async fetchEquipos() {
        this.equipos = await getEquipos();
        this.updateDropdown();
    }

    handleSelectChange(event) {
        const equipoId = event.target.value;
        this.selectedEquipo = this.equipos.find(e => e.id === equipoId);
        this.updateForm();
    }

    async handleSubmit(event) {
        event.preventDefault();
        if (!this.selectedEquipo) return;

        const updatedEquipo = {
            nombre: this.shadowRoot.querySelector('#nombre').value,
            pais: this.shadowRoot.querySelector('#pais').value,
            motor: this.shadowRoot.querySelector('#motor').value,
            imagen: this.shadowRoot.querySelector('#imagen').value
        };

        await updateEquipo(this.selectedEquipo.id, updatedEquipo);
        this.showConfirmationMessage();

        // Despachar evento general indicando que se actualizó un equipo
        this.dispatchEvent(new CustomEvent("teamChanged", {
            bubbles: true,
            detail: {
                action: "update",
                team: { id: this.selectedEquipo.id, ...updatedEquipo }
            }
        }));
    }

    updateDropdown() {
        const select = this.shadowRoot.querySelector('#team-select');
        select.innerHTML = '<option value="">Select a team</option>' +
            this.equipos.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
    }

    updateForm() {
        const form = this.shadowRoot.querySelector('#edit-form');
        if (!this.selectedEquipo) {
            form.style.display = 'none';
            return;
        }
        form.style.display = 'block';
        this.shadowRoot.querySelector('#nombre').value = this.selectedEquipo.nombre;
        this.shadowRoot.querySelector('#pais').value = this.selectedEquipo.pais;
        this.shadowRoot.querySelector('#motor').value = this.selectedEquipo.motor;
        this.shadowRoot.querySelector('#imagen').value = this.selectedEquipo.imagen;
    }

    showConfirmationMessage() {
        const message = this.shadowRoot.querySelector('#confirmation-message');
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }
}

customElements.define('edit-team-component', EditTeamComponent);
