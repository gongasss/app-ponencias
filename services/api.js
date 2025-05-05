import { Alert } from "react-native";

// URL base de la API final
const USE_MOCK = false;
const API_BASE_URL = 'https://ponencias.hybridap.es/api';

export const fetchAsistenteYPonencias = async (id) => {
    if (USE_MOCK) {
        console.log('ID:', id);
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockAsistente = {
                    dni: id,
                    nombre: 'Nombre Mock',
                    apellidos: 'Apellido Mock',
                    ponencias: [
                        { titulo: 'Introducción a React Native (Mock)', hora: '10:00', sala: 'Sala A' },
                        { titulo: 'Backend con Node.js (Mock)', hora: '11:30', sala: 'Sala B' },
                        { titulo: 'GraphQL para principiantes (Mock)', hora: '14:00', sala: 'Sala C' },
                    ].filter(() => Math.random() > 0.3),
                };
                resolve(mockAsistente);
            }, 1000);
        });
    }

    try {
        const response = await fetch(`${API_BASE_URL}/asistentes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const text = await response.text();
        console.log('Respuesta cruda:', text);

        if (!response.ok) {
            Alert.alert('Error al recuperar la información del asistente.', text);
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const asistenteData = JSON.parse(text);

        return {
            Id: asistenteData.Id,
            Nombre: asistenteData.Nombre,
            Apellidos: asistenteData.Apellidos,
            Type: asistenteData.Type,
            Ponencias: asistenteData.Ponencias,
            Scanned: asistenteData.Scanned,
            LastScanDateTime: asistenteData.LastScanDateTime,
        };
    } catch (error) {
        console.error('Error al recuperar la información del asistente y sus ponencias:', error);
        throw error;
    }
};

export const marcarAsistenteEscaneado = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/asistentes/${id}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const text = await response.text();
        console.log('Respuesta cruda:', text);

        if (!response.ok) {
            Alert.alert('Error al marcar como escaneado.', text);
            throw new Error(`HTTP ${response.status}: ${text}`);
        }

        const data = JSON.parse(text);

        Alert.alert('Asistente escaneado', 'La asistencia ha sido registrada correctamente.');

        return data;
    } catch (error) {
        console.error('Error al marcar como escaneado:', error);
        throw error;
    }
};
