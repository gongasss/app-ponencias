import { Alert } from "react-native";

const USE_MOCK = false; // false = API activada
const API_BASE_URL = 'http://192.168.3.7:3000/api'; // Define la URL base de la API

export const fetchAsistenteYPonencias = async (dni) => {

    if (USE_MOCK) {
        console.log('DNI: ', dni);
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockAsistente = {
                    dni,
                    nombre: 'Nombre Mock',
                    apellidos: 'Apellido Mock',
                    ponencias: [
                        { titulo: 'Introducción a React Native (Mock)', hora: '10:00', sala: 'Sala A' },
                        { titulo: 'Backend con Node.js (Mock)', hora: '11:30', sala: 'Sala B' },
                        { titulo: 'GraphQL para principiantes (Mock)', hora: '14:00', sala: 'Sala C' },
                    ].filter(() => Math.random() > 0.3), // Simula tener o no ponencias de forma aleatoria
                };
                resolve(mockAsistente);
            }, 1000);
        });
    }

    try {
        // solicitud a la api
        const response = await fetch(`${API_BASE_URL}/asistentes/${dni}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const text = await response.text(); // debug
        console.log('Respuesta cruda:', text);

        if (!response.ok) {
            Alert.alert('Error al recuperar la información del asistente.', text);
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        // Si la respuesta es exitosa, procesamos los datos
        const asistenteData = JSON.parse(text);

        if (asistenteData.error) {
            Alert.alert('Asistente no encontrado', asistenteData.error);
            throw new Error(asistenteData.error);
        }

        const ponencias = asistenteData.ponencias; // Ponencias asociadas al asistente

        // Si no hay ponencias, lanzar un error (opcional, depende de la lógica de tu app)
        // if (!ponencias || ponencias.length === 0) {
        //     throw new Error('El asistente no está registrado en ninguna ponencia');
        // }

        
        return {
            dni: asistenteData.id,
            nombre: asistenteData.nombre,
            apellidos: asistenteData.apellidos,
            ponencias: asistenteData.ponencias,
        };
    } catch (error) {
        console.error('Error al recuperar la información del asistente y sus ponencias:', error);
        throw error;
    }
};

// Función para marcar al asistente como escaneado
export const marcarAsistenteEscaneado = async (dni) => {
    try {
        const response = await fetch(`${API_BASE_URL}/asistentes/${dni}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const text = await response.text(); // debug
        console.log('Respuesta cruda:', text);

        if (!response.ok) {
            Alert.alert('Error al marcar como escaneado.', text);
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = JSON.parse(text);
        if (data.error) {
            Alert.alert('Error', data.error);
            throw new Error(data.error);
        }

        Alert.alert('Asistente escaneado', data.message);

        return data;  // Retorna la respuesta de la API si fue exitosa
    } catch (error) {
        console.error('Error al marcar como escaneado:', error);
        throw error;
    }
};
