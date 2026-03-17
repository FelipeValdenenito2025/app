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
  LogOut
} from 'lucide-react';

// Componente Principal de la App
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [proyectos, setProyectos] = useState([
    { id: 1, nombre: 'Instalación Eléctrica Mall', cliente: 'Cencosud', monto: 15000000, avance: 65, estado: 'Activo', margen: 32 },
    { id: 2, nombre: 'Mantenimiento Redes Industriales', cliente: 'Agrosuper', monto: 8500000, avance: 100, estado: 'Cerrado', margen: 28 },
    { id: 3, nombre: 'Remodelación Oficinas Centrales', cliente: 'Bci', monto: 12000000, avance: 15, estado: 'Activo', margen: 40 }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-xl">
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
          <NavItem 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<HardHat size={20}/>} 
            label="Proyectos" 
            active={activeTab === 'proyectos'} 
            onClick={() => setActiveTab('proyectos')} 
          />
          <NavItem 
            icon={<Receipt size={20}/>} 
            label="Egresos / Costos" 
            active={activeTab === 'costos'} 
            onClick={() => setActiveTab('costos')} 
          />
          <NavItem 
            icon={<FileText size={20}/>} 
            label="Facturación" 
            active={activeTab === 'facturacion'} 
            onClick={() => setActiveTab('facturacion')} 
          />
          <NavItem 
            icon={<Users size={20}/>} 
            label="Proveedores" 
            active={activeTab === 'proveedores'} 
            onClick={() => setActiveTab('proveedores')} 
          />
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
            <input 
              type="text" 
              placeholder="Buscar proyecto, cliente o factura..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-[#003366] transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">Administrador</p>
              <p className="text-xs text-slate-500">Conectado a Supabase</p>
            </div>
            <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Zona de Trabajo Variable */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <DashboardView proyectos={proyectos} />}
          {activeTab === 'proyectos' && <ProyectosView proyectos={proyectos} />}
          {activeTab === 'costos' && <PlaceholderSection title="Gestión de Egresos" />}
        </div>
      </main>
    </div>
  );
}

// Componentes de Soporte
function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-white/10 text-white font-semibold' 
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {active && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );
}

function DashboardView({ proyectos }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Resumen Financiero</h2>
          <p className="text-slate-500">Estado actual del flujo de caja de la empresa.</p>
        </div>
        <button className="bg-[#003366] text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
          <Plus size={20} />
          Nuevo Proyecto
        </button>
      </div>

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Ventas Recaudadas" 
          amount="$45.200.000" 
          trend="+12.5%" 
          icon={<TrendingUp className="text-emerald-600" />} 
          color="border-emerald-500"
        />
        <StatCard 
          title="Costos Operativos" 
          amount="$28.450.000" 
          trend="-3.2%" 
          icon={<TrendingDown className="text-rose-600" />} 
          color="border-rose-500"
        />
        <StatCard 
          title="Utilidad Neta" 
          amount="$16.750.000" 
          trend="37% Margen" 
          icon={<Wallet className="text-[#003366]" />} 
          color="border-[#003366]"
        />
      </div>

      {/* Lista de Proyectos Prioritarios */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800">Proyectos en Ejecución</h3>
          <button className="text-sm font-semibold text-[#003366] hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Proyecto / Cliente</th>
                <th className="px-6 py-4">Monto Presupuestado</th>
                <th className="px-6 py-4">Avance de Cobro</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Margen</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proyectos.map((proy) => (
                <tr key={proy.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700">{proy.nombre}</p>
                    <p className="text-xs text-slate-400">{proy.cliente}</p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">
                    ${proy.monto.toLocaleString('es-CL')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[120px] bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${proy.avance === 100 ? 'bg-emerald-500' : 'bg-[#003366]'}`} 
                        style={{ width: `${proy.avance}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 block">{proy.avance}% Cobrado</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      proy.estado === 'Activo' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {proy.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">{proy.margen}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, amount, trend, icon, color }) {
  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border-l-4 ${color} transition-transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-slate-50 p-3 rounded-2xl">
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{trend}</span>
      </div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h4 className="text-2xl font-extrabold text-slate-800 mt-1">{amount}</h4>
    </div>
  );
}

function ProyectosView({ proyectos }) {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Catálogo de Proyectos</h2>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
            Exportar Excel
          </button>
          <button className="px-4 py-2 bg-[#003366] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all active:scale-95">
            Nuevo Proyecto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-[#003366] group-hover:text-white transition-colors">
                <HardHat size={24} />
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                p.estado === 'Activo' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {p.estado}
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">{p.nombre}</h3>
            <p className="text-sm text-slate-500 mb-4">{p.cliente}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Presupuesto</span>
                <span className="font-bold text-slate-700">${p.monto.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avance Pago</span>
                <span className="font-bold text-[#003366]">{p.avance}%</span>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-[#003366] hover:text-white transition-all flex items-center justify-center gap-2">
              Ver Detalles Finanzas
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlaceholderSection({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 bg-white rounded-3xl border border-dashed border-slate-300">
      <div className="bg-slate-50 p-6 rounded-full mb-4">
        <Receipt size={48} />
      </div>
      <h3 className="text-xl font-bold text-slate-700">{title}</h3>
      <p className="max-w-xs text-center mt-2">Esta sección está lista para ser conectada con las tablas de Supabase que acabamos de crear.</p>
    </div>
  );
}
