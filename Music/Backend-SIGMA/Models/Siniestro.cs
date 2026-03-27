using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class Siniestro
    {
        [Key]
        public int IdSiniestro { get; set; }

        public int IdVehiculo { get; set; }
        public Vehiculo Vehiculo { get; set; }

        public int IdConductor { get; set; }
        public Usuario Conductor { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;

        [Required]
        public string Descripcion { get; set; } = string.Empty;

        public string? Ubicacion { get; set; }

        public int IdEstatus { get; set; }
        public EstatusSiniestro Estatus { get; set; }

        public int? AtendidoPor { get; set; }
        public Usuario Atendido { get; set; }
        public ICollection<SiniestroEvidencia> Evidencias { get; set; } = new List<SiniestroEvidencia>();
    }
}