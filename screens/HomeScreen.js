import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import QrScanner from '../components/QrScanner';
import PonenciaInfo from '../components/PonenciaInfo';
import { fetchAsistenteYPonencias, marcarAsistenteEscaneado } from '../services/api';

const HomeScreen = () => {
    const [asistenteInfo, setAsistenteInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleQrScanned = async (data) => {
        if (!data) return;

        setLoading(true);
        setError(null);
        setAsistenteInfo(null); // limpia la información anterior
        try {
            const response = await fetchAsistenteYPonencias(data.dni);
            setAsistenteInfo(response);
            console.log('Asistente:', response);

            await marcarAsistenteEscaneado(data.dni);
        } catch (err) {
            setError('Error al obtener la información del asistente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        setAsistenteInfo(null);
        setError(null);
    };

    const handleInvalidQr = (error) => {
        Alert.alert('Error al escanear el código QR', error);
    };

  return (
    <View style={styles.container}>
        {loading ? (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Consultando información...</Text>
            </View>
        ) : (
            <>
                {!asistenteInfo ? (
                    <QrScanner onScanned={handleQrScanned} onInvalidQr={handleInvalidQr} />
                ) : (
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>Información del Asistente</Text>
                        <Text style={styles.detailText}>
                            DNI: {asistenteInfo.dni}
                        </Text>
                        <Text style={styles.detailText}>
                            Nombre: {asistenteInfo.nombre} {asistenteInfo.apellidos}
                        </Text>

                        {asistenteInfo.ponencias && asistenteInfo.ponencias.length > 0 ? (
                            <ScrollView style={styles.ponenciasList}>
                                <Text style={styles.subtitle}>Ponencias Asignadas:</Text>
                                {asistenteInfo.ponencias.map((ponencia, index) => {
                                    if (!ponencia.title || !ponencia.dateTime || !ponencia.location) {
                                        console.warn(`Ponencia con índice ${index} está incompleta.`);
                                        return null; // no se muestran ponencias si los datos no están completos
                                    }
                                    return (
                                        <PonenciaInfo
                                            key={index}
                                            ponencia={ponencia}
                                            onBack={handleGoBack}
                                        />
                                    );
                                })}
                            </ScrollView>
                        ) : (
                            <Text style={styles.noPonencias}>Este asistente no tiene ponencias asignadas.</Text>
                        )}

                        <TouchableOpacity style={styles.scanAgainButton} onPress={handleGoBack}>
                            <Text style={styles.buttonText}>Escanear Otro DNI</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {error && <Text style={styles.error}>{error}</Text>}
            </>
        )}
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    infoContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#3498db',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#333',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    ponenciasList: {
        marginTop: 10,
        maxHeight: 400,
    },
    noPonencias: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#777',
        marginTop: 10,
        textAlign: 'center',
    },
    scanAgainButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;