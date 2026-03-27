namespace Backend_SIGMA.Models.DTO
{
    public class AsignacionDTO
    {
        public int IdAsignacion { get; set; }
        public int IdVehiculo { get; set; }
        public string? VehiculoInfo { get; set; }
        public string? NumeroEconomico { get; set; }
        public string? Placas { get; set; }
        
        public int IdUsuario { get; set; }
        public string? ConductorNombre { get; set; }
        public string? ConductorCorreo { get; set; }
        
        public DateTime FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public bool Activo { get; set; }
        public int DuracionDias { get; set; }
    }
}