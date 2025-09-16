import { memo, useCallback, useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { useFocusEffect } from 'expo-router';
import { Text, View } from 'react-native';

import { Country } from '@/domains';

interface AddressLineProps {
  buildingName?: string | null;
  personName?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phoneNumber?: string | null;
}

const AddressLine: React.FC<AddressLineProps> = memo(function AddressLine({
  buildingName,
  personName,
  addressLine1,
  addressLine2,
  city,
  stateProvince,
  postalCode,
  country,
  phoneNumber,
}) {
  const [countries, setCountries] = useState<Country[]>([]);

  const selectedCountryName = useMemo(() => {
    const selectedCountry = countries.find(
      (singleCountry) => singleCountry.iso2 === country,
    );
    return selectedCountry?.name ?? country;
  }, [countries, country]);

  const lazyLoad = useCallback(async () => {
    const countriesData = await import('@/assets/data/countries.json');

    setCountries(countriesData.default);
  }, []);

  useFocusEffect(
    useCallback(() => {
      lazyLoad();
    }, [lazyLoad]),
  );

  return (
    <View className={clsx(classes.container)}>
      {buildingName && <Text className={classes.text}>{buildingName}</Text>}
      {personName && <Text className={classes.text}>{personName}</Text>}
      <Text className={classes.text}>{addressLine1}</Text>
      {addressLine2 && <Text className={classes.text}>{addressLine2}</Text>}
      {city && <Text className={classes.text}>{city}</Text>}
      {stateProvince && country && !['GB', 'UK'].includes(country) && (
        <Text className={classes.text}>{stateProvince}</Text>
      )}
      {postalCode && <Text className={classes.text}>{postalCode}</Text>}
      {country && <Text className={classes.text}>{selectedCountryName}</Text>}
      {!!phoneNumber?.trim() && (
        <Text className={classes.text}>Phone: {phoneNumber}</Text>
      )}
    </View>
  );
});

const classes = {
  container: 'flex flex-col',
  text: 'text-sm text-slate-600',
};

export default AddressLine;
