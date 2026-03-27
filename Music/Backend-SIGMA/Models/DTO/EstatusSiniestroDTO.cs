namespace Backend_SIGMA.Models.DTO
{
    public class EstatusSiniestroDTO
    {
        public int IdEstatus { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int TotalSiniestros { get; set; }
    }
}