using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }

        [Required, MaxLength(100)]
        public string Nombre { get; set; }

        [Required, MaxLength(120)]
        public string Correo { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [MaxLength(20)]
        public string? Telefono { get; set; }

        public bool Estatus { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public int IdRol { get; set; }
        public Rol Rol { get; set; }

        public ICollection<VehiculoAsignacion> Asignaciones { get; set; }
        public ICollection<Mantenimiento> MantenimientosRegistrados { get; set; }
        public ICollection<Siniestro> SiniestrosComoConductor { get; set; }
        public ICollection<Siniestro> SiniestrosAtendidos { get; set; }
    }
}