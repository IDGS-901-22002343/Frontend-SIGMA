namespace Backend_SIGMA.Models.Request
{
    public class MantenimientoUpdateRequest
    {
        public int? IdTipo { get; set; }
        public DateTime? Fecha { get; set; }
        public int? Kilometraje { get; set; }
        public decimal? Costo { get; set; }
        public int? IdProveedor { get; set; }
        public string? Observaciones { get; set; }
    }
}