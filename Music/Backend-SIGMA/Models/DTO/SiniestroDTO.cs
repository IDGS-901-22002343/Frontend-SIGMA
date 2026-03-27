namespace Backend_SIGMA.Models.DTO
{
    public class SiniestroDTO
    {
        public int IdSiniestro { get; set; }
        
        // Vehículo
        public int IdVehiculo { get; set; }
        public string? VehiculoInfo { get; set; }
        public string? NumeroEconomico { get; set; }
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? Placas { get; set; }
        
        // Conductor
        public int IdConductor { get; set; }
        public string? ConductorNombre { get; set; }
        public string? ConductorCorreo { get; set; }
        public string? ConductorTelefono { get; set; }
        
        // Siniestro
        public DateTime Fecha { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string? Ubicacion { get; set; }
        
        // Estatus
        public int IdEstatus { get; set; }
        public string? EstatusNombre { get; set; }
        
        // Atendido por
        public int? AtendidoPor { get; set; }
        public string? AtendidoPorNombre { get; set; }
        
        // Evidencias
        public List<SiniestroEvidenciaDTO> Evidencias { get; set; } = new();
    }
}