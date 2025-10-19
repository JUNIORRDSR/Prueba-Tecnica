const api = axios.create({ baseURL: '/api' });
const charts = { estadosBar: null, estadosDonut: null, timeline: null };
let proyectosCache = [];

function formatearFecha(valor) {
  if (!valor) return '';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '';
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(fecha);
}

function obtenerEtiquetaEstado(estado) {
  switch (estado) {
    case 'EN_PROGRESO':
      return 'En progreso';
    case 'FINALIZADO':
      return 'Finalizado';
    case 'PENDIENTE':
      return 'Pendiente';
    default:
      return estado;
  }
}

function obtenerClaseEstado(estado) {
  switch (estado) {
    case 'EN_PROGRESO':
      return 'status-badge status-en_progreso';
    case 'FINALIZADO':
      return 'status-badge status-finalizado';
    case 'PENDIENTE':
      return 'status-badge status-pendiente';
    default:
      return 'status-badge';
  }
}

function agruparPorEstado(proyectos) {
  const counts = { EN_PROGRESO: 0, FINALIZADO: 0, PENDIENTE: 0 };
  for (const proyecto of proyectos) {
    if (counts[proyecto.estado] !== undefined) counts[proyecto.estado]++;
  }
  return counts;
}

function agruparPorMes(proyectos) {
  const mapa = new Map();
  for (const proyecto of proyectos) {
    if (!proyecto.fechaInicio) continue;
    const fecha = new Date(proyecto.fechaInicio);
    if (Number.isNaN(fecha.getTime())) continue;
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    mapa.set(clave, (mapa.get(clave) || 0) + 1);
  }
  const clavesOrdenadas = Array.from(mapa.keys()).sort();
  const labels = clavesOrdenadas.map((clave) => {
    const [year, month] = clave.split('-');
    return new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(Number(year), Number(month) - 1));
  });
  const valores = clavesOrdenadas.map((clave) => mapa.get(clave));
  return { labels, valores };
}

function actualizarKpis(proyectos) {
  const total = proyectos.length;
  const activos = proyectos.filter((p) => p.estado === 'EN_PROGRESO').length;
  const finalizados = proyectos.filter((p) => p.estado === 'FINALIZADO').length;
  const productividad = total > 0 ? Math.round((finalizados / total) * 100) : 0;
  document.getElementById('kpiTotal').textContent = total;
  document.getElementById('kpiActivos').textContent = activos;
  document.getElementById('kpiFinalizados').textContent = finalizados;
  document.getElementById('kpiProductividad').textContent = total > 0 ? `${productividad}% completado` : '--';
}

function crearChart(clave, ctx, config) {
  if (!ctx) return;
  if (charts[clave]) charts[clave].destroy();
  charts[clave] = new Chart(ctx, config);
}

function actualizarCharts(proyectos) {
  const estados = agruparPorEstado(proyectos);
  const labelsEstados = Object.keys(estados).map((estado) => obtenerEtiquetaEstado(estado));
  const valoresEstados = Object.values(estados);

  const ctxBar = document.getElementById('chartEstadosBar');
  crearChart('estadosBar', ctxBar, {
    type: 'bar',
    data: {
      labels: labelsEstados,
      datasets: [
        {
          label: 'Proyectos',
          data: valoresEstados,
          backgroundColor: ['rgba(99, 102, 241, 0.85)', 'rgba(34, 211, 238, 0.85)', 'rgba(244, 114, 182, 0.9)'],
          borderColor: ['rgba(129, 140, 248, 0.9)', 'rgba(94, 234, 212, 0.85)', 'rgba(244, 114, 182, 0.95)'],
          borderWidth: 2,
          borderRadius: 16,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.12)' },
          ticks: { color: 'rgba(226, 232, 240, 0.75)' },
        },
        x: {
          grid: { color: 'rgba(148, 163, 184, 0.08)' },
          ticks: { color: 'rgba(226, 232, 240, 0.75)' },
        },
      },
    },
  });

  const ctxDonut = document.getElementById('chartEstadosDonut');
  crearChart('estadosDonut', ctxDonut, {
    type: 'doughnut',
    data: {
      labels: labelsEstados,
      datasets: [
        {
          data: valoresEstados,
          backgroundColor: ['rgba(99, 102, 241, 0.88)', 'rgba(45, 212, 191, 0.88)', 'rgba(244, 114, 182, 0.9)'],
          borderWidth: 2,
          borderColor: '#0b1220',
        },
      ],
    },
    options: {
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: 'rgba(226, 232, 240, 0.78)' },
        },
      },
    },
  });

  const { labels, valores } = agruparPorMes(proyectos);
  const ctxLine = document.getElementById('chartTimeline');
  crearChart('timeline', ctxLine, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Proyectos iniciados',
          data: valores,
          tension: 0.35,
          fill: true,
          backgroundColor: 'rgba(99, 102, 241, 0.22)',
          borderColor: 'rgba(99, 102, 241, 0.9)',
          pointBackgroundColor: '#0b1220',
          pointBorderColor: '#818cf8',
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: { color: 'rgba(226, 232, 240, 0.78)' },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(148, 163, 184, 0.12)' },
          ticks: { color: 'rgba(226, 232, 240, 0.75)' },
        },
        x: {
          grid: { color: 'rgba(148, 163, 184, 0.08)' },
          ticks: { color: 'rgba(226, 232, 240, 0.75)' },
        },
      },
    },
  });
}

function renderTabla(proyectos) {
  const tbody = document.querySelector('#tabla tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  for (const proyecto of proyectos) {
    const tr = document.createElement('tr');
    const descripcion = proyecto.descripcion ? proyecto.descripcion.trim() : 'Sin descripción';
    const descripcionPreview = descripcion.length > 120 ? `${descripcion.slice(0, 117)}...` : descripcion;
    const inicio = formatearFecha(proyecto.fechaInicio) || '—';
    const fin = formatearFecha(proyecto.fechaFin) || '—';

    tr.innerHTML = `
      <td class="cell-id">${proyecto.id}</td>
      <td>
        <div class="project-title">${proyecto.nombre || 'Sin nombre'}</div>
        <div class="project-desc">${descripcionPreview}</div>
      </td>
      <td class="col-status"><span class="${obtenerClaseEstado(proyecto.estado)}"><span class="badge-dot"></span>${obtenerEtiquetaEstado(proyecto.estado)}</span></td>
      <td class="col-date"><span class="project-date">${inicio}</span></td>
      <td class="col-date"><span class="project-date">${fin}</span></td>
      <td class="text-end col-actions">
        <div class="action-group">
          <button class="action-btn action-edit" data-id="${proyecto.id}" title="Editar proyecto"><i class="bi bi-pencil"></i></button>
          <button class="action-btn action-delete" data-id="${proyecto.id}" title="Eliminar proyecto"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    `;

    tr.querySelector('.action-edit').addEventListener('click', async (event) => {
      const id = event.currentTarget.getAttribute('data-id');
      await abrirModalEditar(id);
    });

    tr.querySelector('.action-delete').addEventListener('click', async (event) => {
      const id = event.currentTarget.getAttribute('data-id');
      if (confirm('¿Eliminar este proyecto?')) {
        await api.delete(`/proyectos/${id}`);
        await cargarTodo();
      }
    });

    tbody.appendChild(tr);
  }
}

async function cargarTodo() {
  const { data } = await api.get('/proyectos');
  proyectosCache = data;
  actualizarKpis(proyectosCache);
  actualizarCharts(proyectosCache);
  renderTabla(proyectosCache);
}

async function abrirModalEditar(id) {
  const { data: proyecto } = await api.get(`/proyectos/${id}`);
  document.getElementById('editId').value = proyecto.id;
  document.getElementById('editNombre').value = proyecto.nombre;
  document.getElementById('editDescripcion').value = proyecto.descripcion || '';
  document.getElementById('editEstado').value = proyecto.estado;
  document.getElementById('editFechaInicio').value = proyecto.fechaInicio
    ? new Date(proyecto.fechaInicio).toISOString().split('T')[0]
    : '';
  document.getElementById('editFechaFin').value = proyecto.fechaFin
    ? new Date(proyecto.fechaFin).toISOString().split('T')[0]
    : '';
  const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
  modal.show();
}

function registrarEventos() {
  document.getElementById('btnGuardarEdicion').addEventListener('click', async () => {
    const id = document.getElementById('editId').value;
    const payload = {
      nombre: document.getElementById('editNombre').value,
      descripcion: document.getElementById('editDescripcion').value,
      estado: document.getElementById('editEstado').value,
      fechaInicio: document.getElementById('editFechaInicio').value
        ? new Date(document.getElementById('editFechaInicio').value).toISOString()
        : null,
      fechaFin: document.getElementById('editFechaFin').value
        ? new Date(document.getElementById('editFechaFin').value).toISOString()
        : null,
    };
    await api.put(`/proyectos/${id}`, payload);
    bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
    await cargarTodo();
  });

  document.getElementById('formProyecto').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    payload.fechaInicio = payload.fechaInicio ? new Date(payload.fechaInicio).toISOString() : null;
    payload.fechaFin = payload.fechaFin ? new Date(payload.fechaFin).toISOString() : null;
    await api.post('/proyectos', payload);
    event.currentTarget.reset();
    await cargarTodo();
  });

  document.getElementById('btnAnalisis').addEventListener('click', cargarAnalisis);

  document.getElementById('btnAnalisisLimpiar').addEventListener('click', () => {
    document.getElementById('resumenIA').textContent = 'Pulsa "Generar resumen" para obtener el análisis más reciente.';
  });

  document.getElementById('btnNuevoProyecto').addEventListener('click', () => {
    document.getElementById('formProyecto').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function cargarAnalisis() {
  const pre = document.getElementById('resumenIA');
  pre.textContent = 'Generando análisis...';
  const eventSource = new EventSource('/api/analisis');
  let textoAcumulado = '';

  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.done) {
        pre.textContent = payload.resumen || textoAcumulado || 'No se recibieron datos.';
        eventSource.close();
      } else if (payload.chunk) {
        textoAcumulado += payload.chunk;
        pre.textContent = textoAcumulado;
      }
    } catch (error) {
      console.error('Error parseando SSE:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('Error en EventSource:', error);
    pre.textContent = 'Error al generar análisis. Intenta nuevamente más tarde.';
    eventSource.close();
  };
}

registrarEventos();
cargarTodo();
