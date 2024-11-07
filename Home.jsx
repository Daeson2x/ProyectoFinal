import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Íconos vectoriales

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temperatura: "",
      imagenTemp: "",
      ciudad: "Guadalajara",
      humedad: "",
      viento: "",
    };
  }

  componentDidMount() {
    this.buscarClima();
  }

  buscarClima = async () => {
    // Coordenadas de Guadalajara
    const lat = 20.6597;
    const lon = -103.3496;

    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=19bd867e8eba4ac7afa192017240309&q=${lat},${lon}&aqi=no`
      );
      const datos = await response.json();
      this.setState({
        temperatura: datos.current.temp_c,
        imagenTemp: `https:${datos.current.condition.icon}`,
        ciudad: datos.location.name,
        humedad: datos.current.humidity,
        viento: datos.current.wind_kph,
      });
    } catch (error) {
      console.error("Error al buscar los datos del clima:", error);
    }
  };

  render() {
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: 'flex-start' }}>
        {/* Fila superior con clima, logo y perfil */}
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 20,
        }}>
          {/* Clima en la parte izquierda */}
          <View style={{
            flexDirection: 'column', 
            alignItems: 'center', 
            paddingVertical: 8, 
            paddingHorizontal: 12, 
            borderRadius: 10, 
            backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            justifyContent: 'center',
            width: 100, // Asegura que el clima no ocupe más espacio
            height: 100, // Ajusta la altura para que se vea más balanceado
            marginRight: 10, // Añade algo de espacio entre el clima y el logo
          }}>
            {this.state.imagenTemp ? (
              <Image 
                style={{ width: 40, height: 40 }} 
                source={{ uri: this.state.imagenTemp }} 
              />
            ) : (
              <Image 
                style={{ width: 40, height: 40 }} 
                source={require("./Imagenes/nubes.png")} 
              />
            )}
            <Text style={{ fontSize: 18, color: 'black', marginTop: 5 }}>
              {this.state.temperatura}°C
            </Text>
            <Text style={{ fontSize: 14, color: 'black' }}>
              {this.state.ciudad}
            </Text>
          </View>

          {/* Logo de la escuela en el centro */}
          <Image 
            source={require("./Imagenes/cucei-logo.png")} // Reemplaza con la ruta del logo
            style={{ width: 120, height: 40 }} // Ajusta el tamaño del logo
          />

          {/* Ícono del perfil en la parte derecha */}
          <View style={{
            backgroundColor: '#f0f0f0',
            borderRadius: 50, 
            padding: 10, 
            justifyContent: 'center',
            alignItems: 'center',
            width: 50, // Asegura que el ícono de perfil tenga un tamaño consistente
            height: 50,
          }}>
            <Icon 
              name="home" 
              size={30} 
              color="black" 
            />
          </View>
        </View>

        {/* Resto del contenido */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }}>Más información sobre el clima...</Text>
        </View>
      </View>
    );
  }
}
