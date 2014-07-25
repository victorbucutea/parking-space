package ro.sft.parking.map;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.*;
import ro.sft.parking.parkingspace.main.R;
import ro.sft.parking.util.Util;

/**
 * Created by VictorBucutea on 21.07.2014.
 */
public class ParkingSpaceMapFragment extends InteractiveMapFragment  {


    /**
     * default map zoom level
     */
    private static float ZOOM = 17.0f;


    private Marker currentLocation;
    private Circle openSpotsRadius;

    @Override
    public void onLocationChanged(Location location) {
        boolean gpsProvider = location.getProvider().equals(LocationManager.GPS_PROVIDER);

        if (mLocation == null || gpsProvider) {
            centerMapAtNewLocation(location);
        }
        mLocation = location;
    }

    public void setSearchRange(int newRadiusInMeters) {
        if (newRadiusInMeters < 0 ){
            return;
        }
        openSpotsRadius.setRadius(newRadiusInMeters);
    }


    private void centerMapAtNewLocation(Location location) {
        String text = "Location changed " + location.getLatitude() + " x " + location.getLongitude() +
                " , speed " + location.getSpeed() + " , bearing to " +
                (mLocation != null ? mLocation.bearingTo(location) : location.getBearing());
        Util.showToast(text, getActivity());

        GoogleMap map = getMap();
        LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
        addRangeCircle(latLng, map);
        addCurrentLocationIcon(latLng, map);
        map.getUiSettings().setMyLocationButtonEnabled(true);
        map.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, ZOOM));
    }

    private void addCurrentLocationIcon(LatLng latLng, GoogleMap map) {

        if (currentLocation == null) {
            BitmapDrawable bd = (BitmapDrawable) getResources().getDrawable(R.drawable.navigation);
            Bitmap b = bd.getBitmap();
            Bitmap bhalfsize = Bitmap.createScaledBitmap(b, (int) (b.getWidth() / 2.5), (int) (b.getHeight() / 2.5), false);
            BitmapDescriptor icon = BitmapDescriptorFactory.fromBitmap(bhalfsize);
            currentLocation = map.addMarker(new MarkerOptions().position(latLng).icon(icon).flat(true));
        } else {
            currentLocation.setPosition(latLng);
        }

    }

    private void addRangeCircle(LatLng latLng, GoogleMap map) {
        if (openSpotsRadius == null) {
            CircleOptions circleOptions = new CircleOptions();
            circleOptions.center(latLng);
            circleOptions.radius(getResources().getInteger(R.integer.defaultSearchRadius)); // radius of circle in meters
            circleOptions.strokeColor(Color.BLUE);//apply stroke with blue
            circleOptions.strokeWidth(1.3f);
            openSpotsRadius = map.addCircle(circleOptions);
        } else {
            openSpotsRadius.setCenter(latLng);
        }

    }


}
