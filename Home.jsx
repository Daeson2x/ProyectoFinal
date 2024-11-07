import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temperatura: "",
      imagenTemp: "",
      bandera: true,
      humedad: "20",
      ciudad: "",
      viento: "20",
      pronostico: [
        { temperatura: "20", imagenTemp: "", humedad: "20", viento: "20" },
        { temperatura: "20", imagenTemp: "", humedad: "20", viento: "20" },
        { temperatura: "20", imagenTemp: "", humedad: "20", viento: "20" },
        { temperatura: "20", imagenTemp: "", humedad: "20", viento: "20" },
        { temperatura: "20", imagenTemp: "", humedad: "20", viento: "20" }
      ],
    };
  }

  componentDidMount() {
    this.solicitarPermisoUbicacion();
  }

  solicitarPermisoUbicacion = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permiso de Ubicación",
        message: "Esta app necesita acceso a tu ubicación para mostrar el clima.",
        buttonNeutral: "Preguntar luego",
        buttonNegative: "Cancelar",
        buttonPositive: "Aceptar"
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.obtenerUbicacion();
    } else {
      console.log("Permiso de ubicación denegado");
    }
  };

  obtenerUbicacion = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.buscarClima(latitude, longitude);
      },
      (error) => console.error("Error al obtener la ubicación:", error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  buscarClima = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=19bd867e8eba4ac7afa192017240309&q=${lat},${lon}&days=5&aqi=no&alerts=no`
      );
      const datos = await response.json();
      this.setState({
        temperatura: datos.current.temp_c,
        imagenTemp: `https:${datos.current.condition.icon}`,
        bandera: false,
        humedad: datos.current.humidity,
        viento: datos.current.wind_kph,
        pronostico: datos.forecast.forecastday.map((dia) => ({
          temperatura: dia.day.avgtemp_c,
          imagenTemp: `https:${dia.day.condition.icon}`,
          viento: dia.day.maxwind_kph,
          humedad: dia.day.daily_chance_of_rain,
        })),
      });
    } catch (error) {
      console.error("Error al buscar los datos del clima:", error);
    }
  };

  render() {
    return (
      <View>
        <Text style={{ fontSize: 40, textAlign: "center", color: "grey", marginTop: 5 }}>
          Weather App
        </Text>

        {/* Mostrar clima automáticamente obtenido al abrir la app */}
        <View>
          <View>
            {this.state.bandera ? (
              <Image style={{ width: 500, height: 300, marginTop: 35, marginLeft: 2 }} source={require("./Imagenes/nubes.png")} />
            ) : (
              <Image style={{ width: 200, height: 250, marginTop: 20, marginLeft: 90, marginBottom:100 }} source={{ uri: this.state.imagenTemp }} />
            )}
          </View>
          <View style={{ marginTop: -195, marginLeft: 190 }}>
            <Text style={{ fontSize: 52, marginLeft:-30, marginTop:-50 }}>{this.state.temperatura}°</Text>
          </View>
        </View>

        <ScrollView horizontal>
          {this.state.pronostico.map((dia, index) => (
            <View key={index} style={{ borderWidth: 4, width: 150, height: 150, borderColor: "navy", borderRadius: 15, marginLeft: 20, marginTop: 40 }}>
              <Image source={{ uri: dia.imagenTemp }} style={{ width: 85, height: 85, marginLeft: 28 }} />
              <Text style={{ marginTop: -60, marginLeft: 55, fontSize: 25 }}>{dia.temperatura}°</Text>
              <Image style={{ width: 40, height: 40, marginTop: 20, marginLeft: 10 }} source={require("./Imagenes/plluvia.png")} />
              <Text style={{ marginLeft: 16 }}>{dia.humedad}%</Text>
              <Image source={require("./Imagenes/viento.png")} style={{ width: 43, height: 43, marginTop: -60, marginLeft: 90 }} />
              <Text style={{ marginLeft: 90 }}>{dia.viento}km</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
