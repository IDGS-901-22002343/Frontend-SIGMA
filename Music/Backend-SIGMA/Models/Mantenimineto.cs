using System.ComponentModel.DataAnnotations;

namespace Backend_SIGMA.Models
{
    public class Mantenimiento
    {
        [Key]
        public int IdMantenimiento { get; set; }

        public int IdVehiculo { get; set; }
        public Vehiculo Vehiculo { get; set; }

        public int IdTipo { get; set; }
        public TipoMantenimiento TipoMantenimiento { get; set; }

        public DateTime Fecha { get; set; }
        public int? Kilometraje { get; set; }
        public decimal? Costo { get; set; }

        public int? IdProveedor { get; set; }
        public Proveedor Proveedor { get; set; }

        public string? Observaciones { get; set; }

        public int? RegistradoPor { get; set; }
        public Usuario UsuarioRegistro { get; set; }
    }
}