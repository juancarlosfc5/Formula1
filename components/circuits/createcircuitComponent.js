import { addCircuito } from '../../api/fetchApi.js';

class CreateCircuitComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEvents();
  }

  setupEvents() {
    const form = this.shadowRoot.getElementById('circuitForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newCircuit = this.getFormData();
      try {
        await addCircuito(newCircuit);
        alert("Circuito registrado con éxito");
        // Aquí se podría emitir un evento para que el modal se cierre desde el componente padre
      } catch (error) {
        console.error("Error al agregar circuito:", error);
      }
    });

    const cancelBtn = this.shadowRoot.getElementById('cancelCreateCircuit');
    cancelBtn.addEventListener('click', () => {
      // Lógica para cerrar el modal dinámico, si se requiere
    });
  }

  getFormData() {
    const nombre = this.shadowRoot.getElementById('nombre').value;
    const pais = this.shadowRoot.getElementById('pais').value;
    const longitud_km = parseFloat(this.shadowRoot.getElementById('longitud_km').value);
    const vueltas = parseInt(this.shadowRoot.getElementById('vueltas').value);
    const descripcion = this.shadowRoot.getElementById('descripcion').value;
    const imagen = this.shadowRoot.getElementById('imagen').value;
    const imagen_detail = this.shadowRoot.getElementById('imagen_detail').value;

    // Nuevos campos para el record de vuelta
    const record_tiempo = this.shadowRoot.getElementById('record_tiempo').value;
    const record_piloto = this.shadowRoot.getElementById('record_piloto').value;
    const record_año = parseInt(this.shadowRoot.getElementById('record_año').value);

    return { 
      id: "circuit-" + Date.now(), 
      nombre, 
      pais, 
      longitud_km, 
      vueltas, 
      descripcion, 
      imagen, 
      imagen_detail,
      record_vuelta: {
         tiempo: record_tiempo,
         piloto: record_piloto,
         año: record_año
      }
    };
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <div class="container">
        <h2 class="mb-4">Crear Circuito</h2>
        <form id="circuitForm">
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre:</label>
            <input type="text" id="nombre" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="pais" class="form-label">País:</label>
            <input type="text" id="pais" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="longitud_km" class="form-label">Longitud (km):</label>
            <input type="number" id="longitud_km" class="form-control" step="0.1" required>
          </div>
          <div class="mb-3">
            <label for="vueltas" class="form-label">Vueltas:</label>
            <input type="number" id="vueltas" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="descripcion" class="form-label">Descripción:</label>
            <textarea id="descripcion" class="form-control"></textarea>
          </div>
          <div class="mb-3">
            <label for="imagen" class="form-label">Imagen (URL):</label>
            <input type="text" id="imagen" class="form-control">
          </div>
          <div class="mb-3">
            <label for="imagen_detail" class="form-label">Imagen Detallada (URL):</label>
            <input type="text" id="imagen_detail" class="form-control">
          </div>
          <!-- Sección para el Record de Vuelta -->
          <fieldset class="mb-3">
            <legend>Record de Vuelta</legend>
            <div class="mb-3">
              <label for="record_tiempo" class="form-label">Tiempo:</label>
              <input type="text" id="record_tiempo" class="form-control" placeholder="1:30.983">
            </div>
            <div class="mb-3">
              <label for="record_piloto" class="form-label">Piloto:</label>
              <input type="text" id="record_piloto" class="form-control" placeholder="Lewis Hamilton">
            </div>
            <div class="mb-3">
              <label for="record_año" class="form-label">Año:</label>
              <input type="number" id="record_año" class="form-control" placeholder="2019">
            </div>
          </fieldset>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button type="button" id="cancelCreateCircuit" class="btn btn-secondary">Cancelar</button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define("create-circuit-component", CreateCircuitComponent);
