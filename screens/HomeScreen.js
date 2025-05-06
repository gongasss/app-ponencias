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
        setAsistenteInfo(null);
    
        try {
            const asistente = await fetchAsistenteYPonencias(data.dni);
    
            // Primero intentamos marcarlo como escaneado
            await marcarAsistenteEscaneado(asistente.Dni);
    
            // Solo si no lanza error, mostramos info
            setAsistenteInfo(asistente);
            console.log('Asistente:', asistente);
        } catch (err) {
            setError('El asistente ya fue escaneado o ocurrió un error.');
            Alert.alert('Error', 'El asistente ya fue escaneado o ocurrió un error.');
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
                            {asistenteInfo.Type === 'invitado' && (
                                <View style={styles.invitadoBadgeTop}>
                                    <Text style={styles.invitadoTextTop}>INVITADO</Text>
                                </View>
                            )}

                            <Text style={styles.title}>Información del Asistente</Text>
                            <Text style={styles.detailText}>
                                ID: {asistenteInfo.Id}
                            </Text>
                            <Text style={styles.detailText}>
                                Nombre: {asistenteInfo.Nombre} {asistenteInfo.Apellidos}
                            </Text>

                            {asistenteInfo.Ponencias && asistenteInfo.Ponencias.length > 0 ? (
                                <ScrollView style={styles.ponenciasList}>
                                    <Text style={styles.subtitle}>Ponencias Asignadas:</Text>
                                    {asistenteInfo.Ponencias.map((ponencia, index) => {
                                        if (!ponencia.Title || !ponencia.FechaInicio || !ponencia.Color) {
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
        overflow: 'hidden',
        zIndex: 1,
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
    invitadoBadge: {
        position: 'absolute',
        top: '4%',
        left: '-20%',
        transform: [{ rotate: '-45deg' }],
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 60,
        zIndex: 2,
    },
    invitadoText: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textAlign: 'center',
        opacity: 0.5,
    },
    invitadoBadgeTop: {
        alignSelf: 'center',
        backgroundColor: '#ffe6e6',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ff9999',
    },
    invitadoTextTop: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HomeScreen;
