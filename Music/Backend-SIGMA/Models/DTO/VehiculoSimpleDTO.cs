namespace Backend_SIGMA.Models.DTO
{
    public class VehiculoSimpleDTO
    {
        public int IdVehiculo { get; set; }
        public string? NumeroEconomico { get; set; }
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? Placas { get; set; }
        public string? Estatus { get; set; }
        public int? KilometrajeActual { get; set; }
        public string? Vin { get; set; }
        public int? Anio { get; set; }
        public DateTime? FechaAlta { get; set; }

    }
}