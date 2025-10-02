
const FormatPeso = (valor) => {
      if (valor == null) return 0;
  const str = String(valor).replace(',', '.');

  const clean = str.replace(/[^0-9.]/g, '');
  console.log(parseFloat(clean))
  return parseFloat(clean);
}



const FormatTelefones = (valor) => {
   const digits = String(valor).replace(/\D/g, '').slice(0, 11);
   return digits
     .replace(/(\d)/, '($1')
      .replace(/(\d{2})(\d)/, '$1) $2' )
      .replace(/(\d)(\d{4})/, '$1 $2')
      .replace(/(\d{4})(\d{4})/, '$1-$2')
  }


    const FormatCPF = (valor) => {
      const digits = String(valor).replace(/\D/g, '').slice(0, 11);
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

  export {FormatTelefones, FormatPeso, FormatCPF}