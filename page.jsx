import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  HardHat, 
  Receipt, 
  FileText, 
  Users, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';

// Componente Principal de la App
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [selectedHito, setSelectedHito] = useState(null);
  
  // Estado de Datos (Simulado - En el futuro vendrá de Supabase)
  const [proyectos, setProyectos] = useState([
    { id: 'PROJ-1', nombre: 'Instalación Eléctrica Mall', cliente: 'Cencosud', rut: '76.123.456-K', monto: 15000000, avance: 65, estado: 'Activo', margen: 32 },
    { id: 'PROJ-2', nombre: 'Mantenimiento Redes Industriales', cliente: 'Agrosuper', rut: '90.444.555-2', monto: 8500000, avance: 100, estado: 'Cerrado', margen: 28 },
    { id: 'PROJ-3', nombre: 'Remodelación Oficinas Centrales', cliente: 'Bci', rut: '96.999.000-1', monto: 12000000, avance: 15, estado: 'Activo', margen: 40 }
  ]);

  const [hitos, setHitos] = useState([
    { id: 'HITO-1', proyectoId: 'PROJ-1', descripcion: 'Anticipo 30%', monto: 4500000, estadoFactura: 'Facturado', estadoPago: 'Pagado' },
    { id: 'HITO-2', proyectoId: 'PROJ-1', descripcion: 'Entrega Materiales', monto: 5000000, estadoFactura: 'Pendiente', estadoPago: 'Pendiente' },
    { id: 'HITO-3', proyectoId: 'PROJ-3', descripcion: 'Inicio de Obra', monto: 1800000, estadoFactura: 'Pendiente', estadoPago: 'Pendiente' },
  ]);

  // Función para solicitar factura (Lógica similar a tu Apps Script)
  const handleSolicitarFactura = (hitoId, glosa, tipoDoc) => {
    // 1. Actualizar el estado local (Simulando el update en Supabase)
    setHitos(prev => prev.map(h => 
      h.id === hitoId ? { ...h, estadoFactura: 'En Proceso' } : h
    ));
    
    // 2. Aquí se dispararía la notificación (Edge Function en Supabase)
    console.log(`Solicitud enviada para ${hitoId}: ${glosa} (${tipoDoc})`);
    
    setShowModal(false);
    setSelectedHito(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white p-2 rounded-lg">
            <ShieldCheck className="text-[#003366] w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">ERP Gerencial</h1>
            <span className="text-[10px] uppercase tracking-widest opacity-60">Urrejola 2026</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<HardHat size={20}/>} label="Proyectos" active={activeTab === 'proyectos'} onClick={() => setActiveTab('proyectos')} />
          <NavItem icon={<FileText size={20}/>} label="Facturación" active={activeTab === 'facturacion'} onClick={() => setActiveTab('facturacion')} />
          <NavItem icon={<Receipt size={20}/>} label="Egresos / Costos" active={activeTab === 'costos'} onClick={() => setActiveTab('costos')} />
          <NavItem icon={<Users size={20}/>} label="Proveedores" active={activeTab === 'proveedores'} onClick={() => setActiveTab('proveedores')} />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 text-white/70 hover:text-white transition-colors w-full p-2">
            <LogOut size={20} />
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Superior */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#003366]" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-[#003366] transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Felipe Valdebenito</p>
                <p className="text-xs text-slate-500">Administrador</p>
              </div>
              <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold shadow-md">F</div>
            </div>
          </div>
        </header>

        {/* Zona de Trabajo Variable */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <DashboardView proyectos={proyectos} hitos={hitos} />}
          {activeTab === 'proyectos' && <ProyectosView proyectos={proyectos} hitos={hitos} onSolicitar={(h) => { setSelectedHito(h); setShowModal(true); }} />}
          {activeTab === 'facturacion' && <FacturacionView proyectos={proyectos} hitos={hitos} onSolicitar={(h) => { setSelectedHito(h); setShowModal(true); }} />}
          {activeTab === 'costos' && <PlaceholderSection title="Egresos y Costos" icon={<Receipt size={48}/>} />}
        </div>
      </main>

      {/* Modal de Solicitud de Factura */}
      {showModal && (
        <ModalSolicitud 
          hito={selectedHito} 
          proyecto={proyectos.find(p => p.id === selectedHito?.proyectoId)}
          onClose={() => setShowModal(false)} 
          onSubmit={handleSolicitarFactura}
        />
      )}
    </div>
  );
}

// --- VISTAS ESPECÍFICAS ---

function DashboardView({ proyectos, hitos }) {
  const pendientes = hitos.filter(h => h.estadoFactura === 'Pendiente').length;
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Panel de Control</h2>
          <p className="text-slate-500">Visión general de las operaciones de Urrejola.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 animate-pulse">
            <AlertCircle size={18} />
            <span className="text-sm font-bold">{pendientes} Hitos por facturar</span>
          </div>
          <button className="bg-[#003366] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
            <Plus size={20} /> Nuevo Proyecto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ventas Facturadas" amount="$45.200.000" trend="+12.5%" icon={<TrendingUp className="text-emerald-600" />} color="border-emerald-500" />
        <StatCard title="Pendiente de Cobro" amount="$12.800.000" trend="4 Facturas" icon={<Clock className="text-amber-600" />} color="border-amber-500" />
        <StatCard title="Egresos Totales" amount="$28.450.000" trend="-3.2%" icon={<TrendingDown className="text-rose-600" />} color="border-rose-500" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800">Próximos Hitos a Cobrar</h3>
          <button className="text-sm font-bold text-[#003366] hover:underline">Ver Calendario</button>
        </div>
        <div className="p-0">
          {hitos.filter(h => h.estadoFactura === 'Pendiente').map(h => {
            const p = proyectos.find(proj => proj.id === h.proyectoId);
            return (
              <div key={h.id} className="flex items-center justify-between p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#003366]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{h.descripcion}</p>
                    <p className="text-xs text-slate-400">{p?.nombre} • {p?.cliente}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-700">${h.monto.toLocaleString('es-CL')}</p>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Por Facturar</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FacturacionView({ proyectos, hitos, onSolicitar }) {
  const pendientes = hitos.filter(h => h.estadoFactura !== 'Facturado');

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Facturación</h2>
          <p className="text-slate-500">Solicita y gestiona documentos tributarios con contabilidad.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
          <Clock size={18} /> Historial de Solicitudes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendientes.length > 0 ? pendientes.map(h => {
          const p = proyectos.find(proj => proj.id === h.proyectoId);
          return (
            <div key={h.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${h.estadoFactura === 'En Proceso' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-lg text-slate-800">{h.descripcion}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      h.estadoFactura === 'En Proceso' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {h.estadoFactura}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{p?.nombre} • Cliente: {p?.cliente}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 px-4 border-l border-slate-100 hidden lg:flex">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Monto Bruto</p>
                  <p className="font-bold text-slate-700">${h.monto.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">RUT Cliente</p>
                  <p className="text-sm font-medium text-slate-600">{p?.rut}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {h.estadoFactura === 'Pendiente' ? (
                  <button 
                    onClick={() => onSolicitar(h)}
                    className="bg-[#003366] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#004d99] transition-colors"
                  >
                    Solicitar Factura <ArrowRight size={16} />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-sm px-4">
                    <Clock size={18} /> Esperando PDF del Contador
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
             No hay hitos pendientes de facturación.
          </div>
        )}
      </div>
    </div>
  );
}

function ModalSolicitud({ hito, proyecto, onClose, onSubmit }) {
  const [glosa, setGlosa] = useState(hito?.descripcion || '');
  const [tipo, setTipo] = useState('Factura Electrónica');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Nueva Solicitud</h3>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Hito: {hito?.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Proyecto:</span><span className="font-bold text-slate-700">{proyecto?.nombre}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Cliente:</span><span className="font-bold text-slate-700">{proyecto?.cliente}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Monto:</span><span className="font-bold text-[#003366]">${hito?.monto.toLocaleString()}</span></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo de Documento</label>
              <select 
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#003366]"
              >
                <option>Factura Electrónica</option>
                <option>Boleta de Honorarios</option>
                <option>Nota de Crédito</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Glosa para el SII</label>
              <textarea 
                value={glosa}
                onChange={(e) => setGlosa(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#003366] h-24 resize-none"
                placeholder="Ej: Pago anticipado por servicios de..."
              />
            </div>
          </div>
        </div>

        <div className="p-8 pt-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
          <button 
            onClick={() => onSubmit(hito.id, glosa, tipo)}
            className="flex-1 bg-[#003366] text-white py-3 font-bold rounded-xl shadow-lg shadow-[#003366]/20 hover:bg-[#004d99] transition-all"
          >
            Enviar al Contador
          </button>
        </div>
      </div>
    </div>
  );
}

// --- OTROS COMPONENTES ---

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-white/10 text-white font-bold' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
      {icon} <span className="text-sm">{label}</span> {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );
}

function StatCard({ title, amount, trend, icon, color }) {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border-l-4 ${color} transition-transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-slate-50 p-3 rounded-2xl">{icon}</div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{trend}</span>
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h4 className="text-2xl font-extrabold text-slate-800 mt-1">{amount}</h4>
    </div>
  );
}

function ProyectosView({ proyectos, hitos, onSolicitar }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Catálogo de Proyectos</h2>
        <button className="bg-[#003366] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-[#003366]/20">
          <Plus size={20} /> Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map(p => {
          const hitosProy = hitos.filter(h => h.proyectoId === p.id);
          return (
            <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-[#003366] group-hover:text-white transition-colors">
                  <HardHat size={24} />
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.estado === 'Activo' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>{p.estado}</span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">{p.nombre}</h3>
              <p className="text-sm text-slate-500 mb-6">{p.cliente}</p>
              
              <div className="space-y-3 mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Hitos del Proyecto</p>
                {hitosProy.map(h => (
                  <div key={h.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-xs">
                    <span className="text-slate-600 truncate max-w-[120px]">{h.descripcion}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#003366]">${(h.monto/1000).toFixed(0)}k</span>
                      {h.estadoFactura === 'Pendiente' ? (
                        <button onClick={() => onSolicitar(h)} className="text-[#003366] hover:text-[#004d99] p-1"><FileText size={14}/></button>
                      ) : (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-[#003366] hover:text-white transition-all">Ver Detalles</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlaceholderSection({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-300 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
      <div className="bg-slate-50 p-8 rounded-full mb-4 text-slate-200">{icon}</div>
      <h3 className="text-xl font-bold text-slate-400">{title}</h3>
      <p className="text-sm mt-2">Esta sección está lista para la conexión con el SII.</p>
    </div>
  );
}