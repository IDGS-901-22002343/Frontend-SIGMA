namespace Backend_SIGMA.Models.DTO
{
    public class SiniestroListDTO
    {
        public int IdSiniestro { get; set; }
        public int IdVehiculo { get; set; }
        public string? VehiculoInfo { get; set; } // "ECO-001 - Toyota Hilux"
        public string? NumeroEconomico { get; set; }
        public string? Placas { get; set; }
        
        public int IdConductor { get; set; }
        public string? ConductorNombre { get; set; }
        
        public DateTime Fecha { get; set; }
        public string? Descripcion { get; set; }
        public string? Ubicacion { get; set; }
        
        public int IdEstatus { get; set; }
        public string? EstatusNombre { get; set; }
        
        public int? AtendidoPor { get; set; }
        public string? AtendidoPorNombre { get; set; }
        
        public int TotalEvidencias { get; set; }
    }
}