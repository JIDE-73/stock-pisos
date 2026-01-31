import React, { useState, useMemo } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { FormControl, FormControlLabel, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { ChevronDownIcon } from '@/components/ui/icon';
import { Pressable, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface Establecimiento {
  id: string;
  nombre: string;
  calle: string;
  cp: string;
  colonia: string;
  celular: string;
}

interface Estante {
  id: string;
  establecimientoId: string;
  establecimientoNombre: string;
  seccion: string;
  nivel: number;
  codigo: string;
}

interface Producto {
  id: string;
  foto: string | null;
  nombre: string;
  tipo: string;
  cantidad: number;
  precioVenta: number;
  costoCompra: number;
  ganancia: number;
  establecimientoId: string;
  establecimientoNombre: string;
  estanteId: string;
  estanteCodigo: string;
  codigo: string;
  fechaCreacion: string;
}

export default function Productos() {
  // En una app real, esto vendría de un contexto o estado global
  const [establecimientos] = useState<Establecimiento[]>([
    {
      id: '1',
      nombre: 'Almacén Central',
      calle: 'Av. Principal 123',
      cp: '12345',
      colonia: 'Centro',
      celular: '5551234567',
    },
  ]);

  const [estantes] = useState<Estante[]>([
    {
      id: '1',
      establecimientoId: '1',
      establecimientoNombre: 'Almacén Central',
      seccion: 'A',
      nivel: 1,
      codigo: 'A-01',
    },
    {
      id: '2',
      establecimientoId: '1',
      establecimientoNombre: 'Almacén Central',
      seccion: 'A',
      nivel: 2,
      codigo: 'A-02',
    },
  ]);

  const [productos, setProductos] = useState<Producto[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    foto: null as string | null,
    nombre: '',
    tipo: '',
    cantidad: '',
    precioVenta: '',
    costoCompra: '',
    establecimientoId: '',
    estanteId: '',
  });

  const [errors, setErrors] = useState({
    foto: '',
    nombre: '',
    tipo: '',
    cantidad: '',
    precioVenta: '',
    costoCompra: '',
    establecimientoId: '',
    estanteId: '',
  });

  // Filtrar estantes por establecimiento seleccionado
  const estantesFiltrados = useMemo(() => {
    if (!formData.establecimientoId) return [];
    return estantes.filter((e) => e.establecimientoId === formData.establecimientoId);
  }, [formData.establecimientoId, estantes]);

  // Calcular ganancia automáticamente
  const ganancia = useMemo(() => {
    const venta = parseFloat(formData.precioVenta) || 0;
    const costo = parseFloat(formData.costoCompra) || 0;
    return venta - costo;
  }, [formData.precioVenta, formData.costoCompra]);

  // Generar código automáticamente
  const codigoGenerado = useMemo(() => {
    if (!formData.estanteId) return '';
    const estante = estantes.find((e) => e.id === formData.estanteId);
    if (!estante) return '';

    const ahora = new Date();
    const fecha = ahora.toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
    return `${fecha}-${estante.codigo}`;
  }, [formData.estanteId, estantes]);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permisos Requeridos',
          'Se necesitan permisos para acceder a la cámara y galería.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handleSelectImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Seleccionar Imagen',
      '¿Cómo desea agregar la foto?',
      [
        {
          text: 'Tomar Foto',
          onPress: async () => {
            try {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                setFormData({ ...formData, foto: result.assets[0].uri });
                if (errors.foto) {
                  setErrors({ ...errors, foto: '' });
                }
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo abrir la cámara');
            }
          },
        },
        {
          text: 'Elegir de Galería',
          onPress: async () => {
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets[0]) {
                setFormData({ ...formData, foto: result.assets[0].uri });
                if (errors.foto) {
                  setErrors({ ...errors, foto: '' });
                }
              }
            } catch (error) {
              Alert.alert('Error', 'No se pudo abrir la galería');
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const validateForm = () => {
    const newErrors = {
      foto: '',
      nombre: '',
      tipo: '',
      cantidad: '',
      precioVenta: '',
      costoCompra: '',
      establecimientoId: '',
      estanteId: '',
    };

    if (!formData.foto) {
      newErrors.foto = 'La foto es requerida';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del producto es requerido';
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo de producto es requerido';
    }

    if (!formData.cantidad.trim()) {
      newErrors.cantidad = 'La cantidad es requerida';
    } else {
      const cantidad = parseInt(formData.cantidad);
      if (isNaN(cantidad) || cantidad < 1) {
        newErrors.cantidad = 'La cantidad debe ser mayor a 0';
      }
    }

    if (!formData.precioVenta.trim()) {
      newErrors.precioVenta = 'El precio de venta es requerido';
    } else {
      const precio = parseFloat(formData.precioVenta);
      if (isNaN(precio) || precio < 0) {
        newErrors.precioVenta = 'El precio de venta debe ser un número válido';
      }
    }

    if (!formData.costoCompra.trim()) {
      newErrors.costoCompra = 'El costo de compra es requerido';
    } else {
      const costo = parseFloat(formData.costoCompra);
      if (isNaN(costo) || costo < 0) {
        newErrors.costoCompra = 'El costo de compra debe ser un número válido';
      }
    }

    if (!formData.establecimientoId) {
      newErrors.establecimientoId = 'Debe seleccionar un establecimiento';
    }

    if (!formData.estanteId) {
      newErrors.estanteId = 'Debe seleccionar un estante';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const establecimiento = establecimientos.find(
        (e) => e.id === formData.establecimientoId
      );
      const estante = estantes.find((e) => e.id === formData.estanteId);

      if (!establecimiento || !estante) return;

      const ahora = new Date();
      const fechaCreacion = ahora.toISOString().slice(0, 10); // YYYY-MM-DD

      const nuevoProducto: Producto = {
        id: Date.now().toString(),
        foto: formData.foto,
        nombre: formData.nombre.trim(),
        tipo: formData.tipo.trim(),
        cantidad: parseInt(formData.cantidad),
        precioVenta: parseFloat(formData.precioVenta),
        costoCompra: parseFloat(formData.costoCompra),
        ganancia: ganancia,
        establecimientoId: establecimiento.id,
        establecimientoNombre: establecimiento.nombre,
        estanteId: estante.id,
        estanteCodigo: estante.codigo,
        codigo: codigoGenerado,
        fechaCreacion: fechaCreacion,
      };

      setProductos([...productos, nuevoProducto]);
      setFormData({
        foto: null,
        nombre: '',
        tipo: '',
        cantidad: '',
        precioVenta: '',
        costoCompra: '',
        establecimientoId: '',
        estanteId: '',
      });
      setShowForm(false);
      setErrors({
        foto: '',
        nombre: '',
        tipo: '',
        cantidad: '',
        precioVenta: '',
        costoCompra: '',
        establecimientoId: '',
        estanteId: '',
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      foto: null,
      nombre: '',
      tipo: '',
      cantidad: '',
      precioVenta: '',
      costoCompra: '',
      establecimientoId: '',
      estanteId: '',
    });
    setErrors({
      foto: '',
      nombre: '',
      tipo: '',
      cantidad: '',
      precioVenta: '',
      costoCompra: '',
      establecimientoId: '',
      estanteId: '',
    });
  };

  // Agrupar productos por establecimiento
  const productosPorEstablecimiento = productos.reduce((acc, producto) => {
    if (!acc[producto.establecimientoId]) {
      acc[producto.establecimientoId] = {
        establecimiento: establecimientos.find((e) => e.id === producto.establecimientoId),
        productos: [],
      };
    }
    acc[producto.establecimientoId].productos.push(producto);
    return acc;
  }, {} as Record<string, { establecimiento?: Establecimiento; productos: Producto[] }>);

  return (
    <Box className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <Box className="p-6">
          <Heading className="font-bold text-3xl mb-6 text-gray-900">
            Productos
          </Heading>

          {establecimientos.length === 0 || estantes.length === 0 ? (
            <Box className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-xl">
              <Text className="text-xl text-yellow-800 text-center font-semibold">
                ⚠️ Primero debe crear establecimientos y estantes
              </Text>
              <Text className="text-lg text-yellow-700 text-center mt-2">
                Vaya a las pestañas correspondientes para crearlos
              </Text>
            </Box>
          ) : !showForm ? (
            <>
              <Box className="mb-6">
                <Button
                  size="xl"
                  action="primary"
                  onPress={() => setShowForm(true)}
                  className="bg-blue-600 py-2"
                >
                  <ButtonText className="text-lg font-semibold">
                    + Agregar Nuevo Producto
                  </ButtonText>
                </Button>
              </Box>

              {/* Lista de Productos */}
              {productos.length === 0 ? (
                <Box className="mt-8 items-center bg-white p-8 rounded-xl border-2 border-gray-200">
                  <Text className="text-xl text-gray-600 text-center">
                    No hay productos registrados
                  </Text>
                  <Text className="text-lg text-gray-500 text-center mt-2">
                    Presiona el botón de arriba para agregar un producto
                  </Text>
                </Box>
              ) : (
                <VStack space="xl">
                  {Object.values(productosPorEstablecimiento).map((grupo) => (
                    <Box key={grupo.establecimiento?.id} className="mb-6">
                      <Box className="bg-blue-100 p-4 rounded-t-xl border-2 border-blue-300">
                        <Text className="text-2xl font-bold text-blue-900">
                          {grupo.establecimiento?.nombre}
                        </Text>
                      </Box>

                      <VStack space="md" className="bg-white border-2 border-blue-300 border-t-0 rounded-b-xl p-4">
                        {grupo.productos.map((producto) => (
                          <Box
                            key={producto.id}
                            className="bg-gray-50 border-2 border-gray-300 p-4 rounded-xl"
                          >
                            <Box className="flex-row gap-4">
                              {producto.foto && (
                                <Image
                                  source={{ uri: producto.foto }}
                                  className="w-24 h-24 rounded-lg"
                                  alt={producto.nombre}
                                />
                              )}
                              <Box className="flex-1">
                                <VStack space="sm">
                                  <Box>
                                    <Text className="text-lg font-semibold text-gray-700">
                                      Nombre:
                                    </Text>
                                    <Text className="text-xl font-bold text-gray-900">
                                      {producto.nombre}
                                    </Text>
                                  </Box>

                                  <Box className="flex-row gap-4">
                                    <Box className="flex-1">
                                      <Text className="text-base font-semibold text-gray-700">
                                        Tipo:
                                      </Text>
                                      <Text className="text-lg text-gray-900">
                                        {producto.tipo}
                                      </Text>
                                    </Box>
                                    <Box className="flex-1">
                                      <Text className="text-base font-semibold text-gray-700">
                                        Cantidad:
                                      </Text>
                                      <Text className="text-lg text-gray-900">
                                        {producto.cantidad}
                                      </Text>
                                    </Box>
                                  </Box>

                                  <Box className="flex-row gap-4">
                                    <Box className="flex-1">
                                      <Text className="text-base font-semibold text-gray-700">
                                        Precio Venta:
                                      </Text>
                                      <Text className="text-lg text-gray-900">
                                        ${producto.precioVenta.toFixed(2)}
                                      </Text>
                                    </Box>
                                    <Box className="flex-1">
                                      <Text className="text-base font-semibold text-gray-700">
                                        Costo:
                                      </Text>
                                      <Text className="text-lg text-gray-900">
                                        ${producto.costoCompra.toFixed(2)}
                                      </Text>
                                    </Box>
                                  </Box>

                                  <Box>
                                    <Text className="text-base font-semibold text-gray-700">
                                      Ganancia:
                                    </Text>
                                    <Text
                                      className={`text-xl font-bold ${
                                        producto.ganancia >= 0
                                          ? 'text-green-600'
                                          : 'text-red-600'
                                      }`}
                                    >
                                      ${producto.ganancia.toFixed(2)}
                                    </Text>
                                  </Box>

                                  <Box className="border-t border-gray-300 pt-2 mt-2">
                                    <Text className="text-base font-semibold text-gray-700">
                                      Ubicación:
                                    </Text>
                                    <Text className="text-lg text-gray-900">
                                      Estante {producto.estanteCodigo}
                                    </Text>
                                  </Box>

                                  <Box>
                                    <Text className="text-base font-semibold text-gray-700">
                                      Código:
                                    </Text>
                                    <Text className="text-lg font-mono text-gray-900">
                                      {producto.codigo}
                                    </Text>
                                  </Box>

                                  <Box>
                                    <Text className="text-base font-semibold text-gray-700">
                                      Fecha de Creación:
                                    </Text>
                                    <Text className="text-lg text-gray-900">
                                      {producto.fechaCreacion}
                                    </Text>
                                  </Box>
                                </VStack>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </>
          ) : (
            <Box className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-md">
              <Heading className="font-bold text-2xl mb-6 text-gray-900">
                Nuevo Producto
              </Heading>
              <Text className="text-lg text-gray-600 mb-6">
                Complete todos los campos para registrar un nuevo producto
              </Text>

              <VStack space="xl">
                {/* Foto */}
                <FormControl isInvalid={!!errors.foto}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Foto del Producto *
                    </Text>
                  </FormControlLabel>
                  <Pressable onPress={handleSelectImage}>
                    <Box
                      className={`border-2 rounded-xl p-4 items-center justify-center ${
                        errors.foto
                          ? 'border-red-500 bg-red-50'
                          : formData.foto
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-400 bg-gray-100'
                      }`}
                      style={{ minHeight: 200 }}
                    >
                      {formData.foto ? (
                        <Image
                          source={{ uri: formData.foto }}
                          className="w-full h-48 rounded-lg"
                          alt="Producto"
                        />
                      ) : (
                        <VStack space="sm" className="items-center">
                          <Box className="w-16 h-16 bg-gray-400 rounded-full items-center justify-center">
                            <Text className="text-3xl text-white">📷</Text>
                          </Box>
                          <Text className="text-lg text-gray-600 text-center">
                            Tocar para tomar foto o elegir de galería
                          </Text>
                        </VStack>
                      )}
                    </Box>
                  </Pressable>
                  {errors.foto && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.foto}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Nombre */}
                <FormControl isInvalid={!!errors.nombre}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Nombre del Producto
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="xl"
                    className={`rounded-xl border-2 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <InputField
                      placeholder="Ejemplo: Laptop HP 15"
                      value={formData.nombre}
                      onChangeText={(text) => {
                        setFormData({ ...formData, nombre: text });
                        if (errors.nombre) {
                          setErrors({ ...errors, nombre: '' });
                        }
                      }}
                      className="text-xl py-3"
                    />
                  </Input>
                  {errors.nombre && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.nombre}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Tipo */}
                <FormControl isInvalid={!!errors.tipo}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Tipo de Producto
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="xl"
                    className={`rounded-xl border-2 ${
                      errors.tipo ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <InputField
                      placeholder="Ejemplo: Electrónica, Ropa, Alimentos"
                      value={formData.tipo}
                      onChangeText={(text) => {
                        setFormData({ ...formData, tipo: text });
                        if (errors.tipo) {
                          setErrors({ ...errors, tipo: '' });
                        }
                      }}
                      className="text-xl py-3"
                    />
                  </Input>
                  {errors.tipo && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.tipo}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Cantidad */}
                <FormControl isInvalid={!!errors.cantidad}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Cantidad
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="xl"
                    className={`rounded-xl border-2 ${
                      errors.cantidad ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <InputField
                      placeholder="Ejemplo: 10"
                      value={formData.cantidad}
                      onChangeText={(text) => {
                        setFormData({
                          ...formData,
                          cantidad: text.replace(/\D/g, ''),
                        });
                        if (errors.cantidad) {
                          setErrors({ ...errors, cantidad: '' });
                        }
                      }}
                      keyboardType="numeric"
                      className="text-xl py-3 text-center"
                    />
                  </Input>
                  {errors.cantidad && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.cantidad}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Precio de Venta */}
                <FormControl isInvalid={!!errors.precioVenta}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Precio de Venta
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="xl"
                    className={`rounded-xl border-2 ${
                      errors.precioVenta ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <InputField
                      placeholder="Ejemplo: 1500.00"
                      value={formData.precioVenta}
                      onChangeText={(text) => {
                        setFormData({
                          ...formData,
                          precioVenta: text.replace(/[^0-9.]/g, ''),
                        });
                        if (errors.precioVenta) {
                          setErrors({ ...errors, precioVenta: '' });
                        }
                      }}
                      keyboardType="decimal-pad"
                      className="text-xl py-3 text-center"
                    />
                  </Input>
                  {errors.precioVenta && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.precioVenta}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Costo de Compra */}
                <FormControl isInvalid={!!errors.costoCompra}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Costo de Compra
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="xl"
                    className={`rounded-xl border-2 ${
                      errors.costoCompra ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <InputField
                      placeholder="Ejemplo: 1200.00"
                      value={formData.costoCompra}
                      onChangeText={(text) => {
                        setFormData({
                          ...formData,
                          costoCompra: text.replace(/[^0-9.]/g, ''),
                        });
                        if (errors.costoCompra) {
                          setErrors({ ...errors, costoCompra: '' });
                        }
                      }}
                      keyboardType="decimal-pad"
                      className="text-xl py-3 text-center"
                    />
                  </Input>
                  {errors.costoCompra && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.costoCompra}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Ganancia (Auto-generada) */}
                <Box className="bg-blue-50 border-2 border-blue-300 p-4 rounded-xl">
                  <Text className="text-xl font-semibold text-blue-900 mb-2">
                    Ganancia (Calculada automáticamente)
                  </Text>
                  <Text
                    className={`text-2xl font-bold ${
                      ganancia >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    ${ganancia.toFixed(2)}
                  </Text>
                  <Text className="text-base text-blue-700 mt-1">
                    Precio de Venta - Costo de Compra
                  </Text>
                </Box>

                {/* Establecimiento */}
                <FormControl isInvalid={!!errors.establecimientoId}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Establecimiento (Almacén)
                    </Text>
                  </FormControlLabel>
                  <Select
                    selectedValue={formData.establecimientoId}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        establecimientoId: value,
                        estanteId: '', // Reset estante al cambiar establecimiento
                      });
                      if (errors.establecimientoId) {
                        setErrors({ ...errors, establecimientoId: '' });
                      }
                    }}
                  >
                    <SelectTrigger
                      variant="outline"
                      size="xl"
                      className={`rounded-xl border-2 ${
                        errors.establecimientoId
                          ? 'border-red-500'
                          : 'border-gray-400'
                      }`}
                    >
                      <SelectInput
                        placeholder="Seleccione un establecimiento"
                        className="text-xl py-3"
                      />
                      <SelectIcon className="mr-3">
                        <ChevronDownIcon />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectScrollView>
                          {establecimientos.map((establecimiento) => (
                            <SelectItem
                              key={establecimiento.id}
                              label={establecimiento.nombre}
                              value={establecimiento.id}
                            />
                          ))}
                        </SelectScrollView>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {errors.establecimientoId && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.establecimientoId}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Estante */}
                <FormControl isInvalid={!!errors.estanteId}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Estante (Sección y Nivel)
                    </Text>
                  </FormControlLabel>
                  <Select
                    selectedValue={formData.estanteId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, estanteId: value });
                      if (errors.estanteId) {
                        setErrors({ ...errors, estanteId: '' });
                      }
                    }}
                    isDisabled={!formData.establecimientoId}
                  >
                    <SelectTrigger
                      variant="outline"
                      size="xl"
                      className={`rounded-xl border-2 ${
                        errors.estanteId
                          ? 'border-red-500'
                          : formData.establecimientoId
                          ? 'border-gray-400'
                          : 'border-gray-300 bg-gray-100'
                      }`}
                    >
                      <SelectInput
                        placeholder={
                          formData.establecimientoId
                            ? 'Seleccione un estante'
                            : 'Primero seleccione un establecimiento'
                        }
                        className="text-xl py-3"
                      />
                      <SelectIcon className="mr-3">
                        <ChevronDownIcon />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectScrollView>
                          {estantesFiltrados.map((estante) => (
                            <SelectItem
                              key={estante.id}
                              label={`${estante.codigo} (Sección ${estante.seccion})`}
                              value={estante.id}
                            />
                          ))}
                        </SelectScrollView>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {errors.estanteId && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.estanteId}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Código (Auto-generado) */}
                {codigoGenerado && (
                  <Box className="bg-green-50 border-2 border-green-300 p-4 rounded-xl">
                    <Text className="text-xl font-semibold text-green-900 mb-2">
                      Código del Producto (Generado automáticamente)
                    </Text>
                    <Text className="text-2xl font-mono font-bold text-green-900">
                      {codigoGenerado}
                    </Text>
                    <Text className="text-base text-green-700 mt-1">
                      Formato: Fecha (YYMMDD) - Estante (Sección-Nivel)
                    </Text>
                  </Box>
                )}

                {/* Botones */}
                <VStack space="md" className="mt-6">
                  <Button
                    size="xl"
                    action="primary"
                    onPress={handleSubmit}
                    className="bg-blue-600 py-2"
                  >
                    <ButtonText className="text-xl font-semibold">
                      Guardar Producto
                    </ButtonText>
                  </Button>
                  <Button
                    size="xl"
                    action="secondary"
                    variant="outline"
                    onPress={handleCancel}
                    className="border-2 border-gray-400 py-2"
                  >
                    <ButtonText className="text-xl font-semibold text-gray-700">
                      Cancelar
                    </ButtonText>
                  </Button>
                </VStack>
              </VStack>
            </Box>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
