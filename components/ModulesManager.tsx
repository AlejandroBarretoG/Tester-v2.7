import React from 'react';
import { 
  LayoutGrid, 
  Download, 
  Trash2, 
  Play, 
  Plus, 
  Database, 
  Sparkles, 
  Mic, 
  HardDrive,
  Box
} from 'lucide-react';
import { MODULES, AppModule, ModuleCapability } from '../modules/ModuleRegistry';

const getCapabilityColor = (cap: ModuleCapability) => {
  if (cap.includes('firebase') || cap === 'firestore' || cap === 'storage') return 'bg-orange-100 text-orange-700 border-orange-200';
  if (cap.includes('gemini')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (cap.includes('voice')) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
  return 'bg-slate-100 text-slate-600 border-slate-200';
};

const getCapabilityIcon = (cap: ModuleCapability) => {
  if (cap.includes('firebase') || cap === 'firestore') return <Database size={10} />;
  if (cap.includes('gemini')) return <Sparkles size={10} />;
  if (cap.includes('voice')) return <Mic size={10} />;
  return <HardDrive size={10} />;
};

interface ModulesManagerProps {
  onLaunch: (moduleId: string) => void;
}

export const ModulesManager: React.FC<ModulesManagerProps> = ({ onLaunch }) => {

  const handleRun = (id: string) => {
    console.log(`[ModuleManager] Ejecutando módulo: ${id}`);
    onLaunch(id);
  };

  const handleExport = (title: string) => {
    alert(`Empaquetando "${title}" para descarga... \n(Simulación de descarga .zip)`);
  };

  const handleDelete = (id: string) => {
    const message = `Para eliminar este módulo, borra manualmente:\n\n1. La carpeta src/modules/${id}\n2. Su entrada en modules/ModuleRegistry.ts`;
    alert(message);
  };

  const handleImport = () => {
    console.log("[ModuleManager] Abriendo diálogo de importación...");
    alert("Próximamente: Importador de repositorios y análisis automático de capabilities.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="text-indigo-600" />
            Gestor de Módulos
          </h2>
          <p className="text-slate-500 mt-1">
            Administra, ejecuta y extiende las capacidades de tu aplicación.
          </p>
        </div>
        <button 
          onClick={handleImport}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all hover:shadow-md"
        >
          <Plus size={18} />
          Importar Nuevo
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => (
          <div key={module.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            
            {/* Card Header */}
            <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                  {React.createElement(module.icon, { size: 20 })}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{module.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">v{module.version}</span>
                    <span className="text-xs text-slate-400">{module.addedAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1">
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {module.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacidades Requeridas</p>
                <div className="flex flex-wrap gap-2">
                  {module.capabilities.map(cap => (
                    <span 
                      key={cap} 
                      className={`text-[10px] font-medium px-2 py-1 rounded-full border flex items-center gap-1 ${getCapabilityColor(cap)}`}
                    >
                      {getCapabilityIcon(cap)}
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-2">
              <button 
                onClick={() => handleRun(module.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Play size={14} /> Ejecutar
              </button>
              
              <div className="flex gap-1">
                <button 
                  onClick={() => handleExport(module.title)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Exportar .zip"
                >
                  <Download size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(module.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar Módulo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

          </div>
        ))}

        {/* Empty State / Add New Placeholder */}
        <button 
          onClick={handleImport}
          className="group border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/10 transition-all min-h-[250px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-500 flex items-center justify-center mb-4 transition-colors">
            <Box size={24} />
          </div>
          <span className="font-medium text-slate-600 group-hover:text-indigo-600">Instalar nuevo módulo</span>
          <span className="text-xs mt-1 opacity-70">Desde repositorio o archivo local</span>
        </button>
      </div>
    </div>
  );
};