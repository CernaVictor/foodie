import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { debounce } from "@mui/material/utils";

const locationInputSx = {
  ".MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ed2647",
    },
  },
  "label.Mui-focused": {
    color: "#ed2647 !important",
  },
  "&:focus label": {
    color: "#ed2647",
  },
  ".MuiFormLabel-focus": {
    color: "#ed2647",
  },
};

const autocompleteService = { current: null };

export default function LocationAutocompleteInput({ selectLocationHandler }) {
  const [locationAddress, setLocationAddress] = React.useState(null);
  const [addressInputValue, setAddressInputValue] = React.useState("");
  const [addressOptions, setAddressOptions] = React.useState([]);

  const fetchAddressOptions = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (addressInputValue === "") {
      setAddressOptions(locationAddress ? [locationAddress] : []);
      return undefined;
    }
    fetchAddressOptions({ input: addressInputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (locationAddress) {
          newOptions = [locationAddress];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setAddressOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [locationAddress, addressInputValue, fetchAddressOptions]);

  return (
    <Autocomplete
      id="google-map-autocomplete"
      fullWidth
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option?.description
      }
      filterOptions={(x) => x}
      options={addressOptions}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={locationAddress}
      noOptionsText="No locations"
      onChange={(event, newValue) => {
        setAddressOptions(
          newValue ? [newValue, ...addressOptions] : addressOptions
        );
        setLocationAddress(newValue);
        if (newValue) {
          selectLocationHandler(newValue?.description);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setAddressInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose your address"
          fullWidth
          sx={locationInputSx}
        ></TextField>
      )}
    />
  );
}
