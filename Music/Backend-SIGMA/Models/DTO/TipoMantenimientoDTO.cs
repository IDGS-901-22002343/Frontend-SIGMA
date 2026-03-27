namespace Backend_SIGMA.Models.DTO
{
    public class TipoMantenimientoDTO
    {
        public int IdTipo { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int TotalMantenimientos { get; set; }
    }
}