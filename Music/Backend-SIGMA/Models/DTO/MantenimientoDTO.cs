namespace Backend_SIGMA.Models.DTO
{
    public class MantenimientoDTO
    {
        public int IdMantenimiento { get; set; }
        public int IdVehiculo { get; set; }
        public string? VehiculoInfo { get; set; } // "ECO-001 - Toyota Hilux"
        public string? NumeroEconomico { get; set; }
        
        public int IdTipo { get; set; }
        public string? TipoNombre { get; set; }
        
        public DateTime Fecha { get; set; }
        public int? Kilometraje { get; set; }
        public decimal? Costo { get; set; }
        
        public int? IdProveedor { get; set; }
        public string? ProveedorNombre { get; set; }
        
        public string? Observaciones { get; set; }
        
        public int? RegistradoPor { get; set; }
        public string? RegistradoPorNombre { get; set; }
    }
}