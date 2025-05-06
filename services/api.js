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
                    Id: id,
                    Nombre: 'Sandra',
                    Apellidos: 'Rodriguez',
                    Type: 'invitado',
                    Ponencias: [
                        {
                            Id: 2,
                            Title: 'Reglamentos',
                            FechaInicio: '2025-05-10T00:00:00',
                            FechaFin: '2025-05-11T00:00:00',
                            FechaModificacion: '2025-04-28T10:43:26.9',
                            Color: '#fdd835',
                        },
                        {
                            Id: 3,
                            Title: 'Juegos',
                            FechaInicio: '2025-05-10T00:00:00',
                            FechaFin: '2025-05-11T00:00:00',
                            FechaModificacion: '2025-04-28T10:43:26.9',
                            Color: '#fff835',
                        },
                    ],
                    Scanned: false,
                    LastScanDateTime: null,
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
