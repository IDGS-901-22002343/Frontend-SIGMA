namespace Backend_SIGMA.Models.Request
{
    public class SiniestroUpdateRequest
    {
        public string? Descripcion { get; set; }
        public string? Ubicacion { get; set; }
        public int? IdEstatus { get; set; }
        public int? AtendidoPor { get; set; }
    }
}