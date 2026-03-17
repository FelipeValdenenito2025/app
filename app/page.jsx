"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, HardHat, Receipt, FileText, Users, Plus, 
  Search, TrendingUp, TrendingDown, Wallet, ArrowRight, 
  MoreVertical, ChevronRight, ShieldCheck, LogOut, Bell, 
  CheckCircle2, Clock, AlertCircle, X, Loader2, Save
} from 'lucide-react';

// --- CONFIGURACIÓN DE SUPABASE ---
// Las llaves se leen de las variables de entorno de Vercel por seguridad
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [proyectos, setProyectos] = useState([]);
  const [hitos, setHitos] = useState([]);
  
  // Estados para modales
  const [showModalFactura, setShowModalFactura] = useState(false);
  const [showModalProyecto, setShowModalProyecto] = useState(false);
  const [selectedHito, setSelectedHito] = useState(null);

  // Cargar datos reales desde Supabase
  const fetchData = async () => {
    if (!supabaseUrl) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const { data: proyData } = await supabase.from('proyectos').select('*').order('creado_at', { ascending: false });
    const { data: hitosData } = await supabase.from('hitos').select('*');
    
    if (proyData) setProyectos(proyData);
    if (hitosData) setHitos(hitosData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para solicitar factura (Actualiza estado en BD)
  const handleSolicitarFactura = async (hitoId) => {
    const { error } = await supabase
      .from('hitos')
      .update({ estado_factura: 'En Proceso' })
      .eq('id', hitoId);

    if (!error) {
      setHitos(prev => prev.map(h => h.id === hitoId ? { ...h, estado_factura: 'En Proceso' } : h));
      setShowModalFactura(false);
    }
  };

  // Función para crear un nuevo proyecto real en Supabase
  const handleCrearProyecto = async (formData) => {
    const { data, error } = await supabase
      .from('proyectos')
      .insert([
        { 
          nombre: formData.nombre,
          cliente: formData.cliente,
          rut_cliente: formData.rut,
          monto_base: parseFloat(formData.monto),
          estado: 'Activo'
        }
      ])
      .select();

    if (!error) {
      fetchData(); // Recargar lista de la base de datos
      setShowModalProyecto(false);
    } else {
      console.error("Error al crear proyecto:", error);
    }
  };

  if (loading && proyectos.length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-[#003366] mb-4" size={48} />
        <p className="text-slate-500 font-bold tracking-tight">Iniciando ERP Urrejola...</p>
      </div>
    );
  }

  if (!supabaseUrl) {
    return <SetupGuide />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="bg-white p-2 rounded-lg"><ShieldCheck className="text-[#003366] w-6 h-6" /></div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-white">ERP Gerencial</h1>
            <span className="text-[10px] uppercase tracking-widest opacity-60">Urrejola 2026</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<HardHat size={20}/>} label="Proyectos" active={activeTab === 'proyectos'} onClick={() => setActiveTab('proyectos')} />
          <NavItem icon={<FileText size={20}/>} label="Facturación" active={activeTab === 'facturacion'} onClick={() => setActiveTab('facturacion')} />
          <NavItem icon={<Receipt size={20}/>} label="Egresos" active={activeTab === 'costos'} onClick={() => setActiveTab('costos')} />
        </nav>
        <div className="p-4 border-t border-white/10 mt-auto">
          <button className="flex items-center gap-3 text-white/70 hover:text-white w-full p-2 transition-colors">
            <LogOut size={20} /> 
            <span className="text-sm font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar proyectos o clientes..." className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#003366]" />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">Felipe Valdebenito</p>
              <p className="text-xs text-slate-500 font-medium">Conectado a Producción</p>
            </div>
            <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition-transform cursor-pointer">F</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <DashboardView 
              proyectos={proyectos} 
              hitos={hitos} 
              onNewProject={() => setShowModalProyecto(true)} 
            />
          )}
          {activeTab === 'proyectos' && (
            <ProyectosView 
              proyectos={proyectos} 
              onNewProject={() => setShowModalProyecto(true)} 
            />
          )}
          {activeTab === 'facturacion' && (
            <FacturacionView 
              proyectos={proyectos} 
              hitos={hitos} 
              onSolicitar={(h) => { setSelectedHito(h); setShowModalFactura(true); }} 
            />
          )}
          {activeTab === 'costos' && <PlaceholderSection title="Módulo de Egresos" icon={<Receipt size={48}/>} />}
        </div>
      </main>

      {/* Modales */}
      {showModalFactura && (
        <ModalSolicitud 
          hito={selectedHito} 
          proyecto={proyectos.find(p => p.id === selectedHito?.proyecto_id)}
          onClose={() => setShowModalFactura(false)} 
          onSubmit={handleSolicitarFactura}
        />
      )}

      {showModalProyecto && (
        <ModalNuevoProyecto 
          onClose={() => setShowModalProyecto(false)} 
          onSubmit={handleCrearProyecto}
        />
      )}
    </div>
  );
}

// --- COMPONENTES INTERNOS ---

function SetupGuide() {
  return (
    <div className="h-screen flex items-center justify-center p-6 bg-[#003366]">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-lg text-center">
        <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-[#003366]" size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Variables de Entorno</h2>
        <p className="text-slate-500 mb-8 font-medium leading-relaxed">Debes configurar las llaves de Supabase en el panel de Vercel (Settings -> Environment Variables) para activar la base de datos.</p>
        <div className="text-left bg-slate-900 text-emerald-400 p-6 rounded-2xl text-xs font-mono mb-8 overflow-x-auto shadow-inner">
          NEXT_PUBLIC_SUPABASE_URL="..."<br/>
          NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
        </div>
        <button className="w-full bg-[#003366] text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-[#002244] transition-all">
          Ir a Vercel Dashboard
        </button>
      </div>
    </div>
  );
}

function DashboardView({ proyectos, hitos, onNewProject }) {
  const pendientesFactura = hitos.filter(h => h.estado_factura === 'Pendiente').length;
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-none mb-2">Resumen Ejecutivo</h2>
          <p className="text-slate-500 font-medium">Monitoreo de proyectos y facturación en tiempo real.</p>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-[#003366] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-[#003366]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Nuevo Proyecto
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Proyectos Activos" amount={proyectos.length} trend="Operativo" icon={<HardHat size={24} className="text-[#003366]" />} color="border-[#003366]" />
        <StatCard title="Hitos x Facturar" amount={pendientesFactura} trend="Pendientes" icon={<Bell size={24} className="text-amber-600" />} color="border-amber-500" />
        <StatCard title="Margen Estimado" amount="34%" trend="+2.4%" icon={<TrendingUp size={24} className="text-emerald-600" />} color="border-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700">
            <Clock size={18} className="text-[#003366]" /> Últimos Movimientos
          </h3>
          <div className="space-y-4">
             {proyectos.slice(0, 4).map(p => (
               <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                 <div>
                   <p className="text-sm font-bold text-slate-700">{p.nombre}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{p.cliente}</p>
                 </div>
                 <span className="text-xs font-black text-[#003366] tracking-tight">${Number(p.monto_base).toLocaleString()}</span>
               </div>
             ))}
             {proyectos.length === 0 && <p className="text-sm text-slate-400 italic py-4 text-center">No hay proyectos registrados aún.</p>}
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#003366] mb-4">
              <TrendingUp size={32} />
           </div>
           <h4 className="font-bold text-slate-800 text-lg">Eficiencia de Cobro</h4>
           <p className="text-sm text-slate-500 max-w-[220px] mt-2 font-medium">Has facturado el 85% de los hitos completados este mes.</p>
        </div>
      </div>
    </div>
  );
}

function ProyectosView({ proyectos, onNewProject }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Cartera de Proyectos</h2>
          <p className="text-sm text-slate-500 font-medium">{proyectos.length} proyectos registrados en base de datos</p>
        </div>
        <button 
          onClick={onNewProject}
          className="bg-[#003366] text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md hover:bg-[#002244] transition-all"
        >
          <Plus size={16}/> Crear Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition-colors duration-300">
                <HardHat size={24}/>
              </div>
              <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${p.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                {p.estado}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-1 text-slate-800 leading-tight group-hover:text-[#003366] transition-colors">{p.nombre}</h3>
            <p className="text-xs text-slate-400 mb-6 font-bold tracking-wide uppercase">{p.cliente}</p>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Presupuesto</p>
                <p className="font-black text-[#003366] text-xl tracking-tighter">${Number(p.monto_base).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#003366] group-hover:bg-blue-50 transition-all duration-300">
                <ArrowRight size={20}/>
              </div>
            </div>
          </div>
        ))}
        {proyectos.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-center">
            <p className="text-slate-400 font-bold">No hay proyectos. ¡Crea el primero!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalNuevoProyecto({ onClose, onSubmit }) {
  const [form, setForm] = useState({ nombre: '', cliente: '', rut: '', monto: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-8 pb-4 flex justify-between items-center">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Nuevo Proyecto</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre del Proyecto</label>
            <input 
              required
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-[#003366] transition-all outline-none"
              placeholder="Ej: Mantenimiento Preventivo Planta A"
              value={form.nombre}
              onChange={(e) => setForm({...form, nombre: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cliente</label>
              <input 
                required
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-[#003366] outline-none"
                placeholder="Nombre Empresa"
                value={form.cliente}
                onChange={(e) => setForm({...form, cliente: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">RUT Cliente</label>
              <input 
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-[#003366] outline-none"
                placeholder="12.345.678-9"
                value={form.rut}
                onChange={(e) => setForm({...form, rut: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Monto Base Inicial ($)</label>
            <input
