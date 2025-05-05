// QrScanner.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { addScannedUser } from '../utils/storage';
import { fetchAsistenteYPonencias } from '../services/api';

const QrScanner = ({ onScanned, onInvalidQr }) => {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Necesitamos permiso para usar la cámara</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Conceder Permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }) => {
      //if (scanned) return;
  
      setScanned(true);
      console.log('DNI escaneado:', data);
  
      // (Opcional) Validación del formato de DNI
      // const dniRegex = /^[0-9]{8}[A-Za-z]$/;
      // if (!dniRegex.test(data)) {
      //     onInvalidQr?.('El código QR no tiene un formato de DNI válido.');
      //     setTimeout(() => setScanned(false), 2000);
      //     return;
      // }
  
      try {
          await addScannedUser(data); // sigue siendo útil para evitar escaneos duplicados rápidos
          onScanned({ dni: data });   // delega todo al padre (HomeScreen)
      } catch (error) {
          onInvalidQr?.('Error procesando el código QR.');
          console.error('Error en QR:', error);
      }
  
      setTimeout(() => setScanned(false), 2000);
  };
  

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.overlayFrame} />
                    <Text style={styles.overlayText}>Escanear código QR del DNI</Text>
                </View>
            </CameraView>

            <TouchableOpacity
                style={styles.flipButton}
                onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            >
                <Text style={styles.buttonText}>Cambiar Cámara</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  overlayFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  overlayText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    margin: 20,
  },
  flipButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default QrScanner;
