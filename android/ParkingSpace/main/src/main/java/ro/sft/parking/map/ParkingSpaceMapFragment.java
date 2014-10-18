package ro.sft.parking.map;

import android.animation.Animator;
import android.animation.Animator.AnimatorListener;
import android.animation.IntEvaluator;
import android.animation.ValueAnimator;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.location.Location;
import android.location.LocationManager;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.*;
import ro.sft.parking.parkingspace.main.R;
import ro.sft.parking.util.Util;

/**
 * Created by VictorBucutea on 21.07.2014.
 */
public class ParkingSpaceMapFragment extends InteractiveMapFragment {


    /**
     * default map zoom level
     */
    private static float ZOOM = 17.0f;


    private Marker currentLocation;
    private Circle openSpotsRadiusCircle;
    private Circle openSpotsSonarCircle;
    private ValueAnimator sonarAnim;
    private boolean centerOnLocationChange = true;
    private boolean deviceLocated = false;

    @Override
    public void onLocationChanged(Location location) {
        boolean gpsProvider = location.getProvider().equals(LocationManager.GPS_PROVIDER);

        if (mLocation == null || gpsProvider) {
            centerMapAtNewLocation(location);
            if (!deviceLocated) {
                centerOnLocationChange = false;//stop centering after located
                deviceLocated = true;
            }
        }
        mLocation = location;
    }

    public void setSearchRange(final int newRadiusInMeters) {
        if (newRadiusInMeters < 0) {
            return;
        }

        if (openSpotsRadiusCircle != null) {
            openSpotsRadiusCircle.setRadius(newRadiusInMeters);
            sonarAnim.setIntValues(getResources().getInteger(R.integer.minSonarStart), newRadiusInMeters);
        }
    }

    public void centerMap(){
        LatLng latLng = new LatLng(mLocation.getLatitude(), mLocation.getLongitude());
        getMap().moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, ZOOM));
    }

    private void centerMapAtNewLocation(Location location) {

        GoogleMap map = getMap();
        LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
        addRangeCircle(latLng, map);
        addCurrentLocationIcon(location, map);

        System.out.println("Centering :"+isCenterOnLocationChange());
        if (isCenterOnLocationChange()) {
            map.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, ZOOM));
        }
    }

    private void addCurrentLocationIcon(Location l ,GoogleMap map) {
        LatLng offsetLatLng = new LatLng(l.getLatitude() , l.getLongitude());
        if (currentLocation == null) {
            BitmapDrawable bd = (BitmapDrawable) getResources().getDrawable(R.drawable.navigation);
            Bitmap b = bd.getBitmap();
            Bitmap bhalfsize = Bitmap.createScaledBitmap(b, (int) (b.getWidth() / 2.5), (int) (b.getHeight() / 2.5), false);
            BitmapDescriptor icon = BitmapDescriptorFactory.fromBitmap(bhalfsize);
            currentLocation = map.addMarker(new MarkerOptions().position(offsetLatLng).icon(icon).flat(true).anchor(0.5f, 0.3f));

        } else {
            currentLocation.setPosition(offsetLatLng);
            currentLocation.setRotation(mLocation != null ? mLocation.bearingTo(l) : l.getBearing());
        }

    }

    private void addRangeCircle(LatLng latLng, GoogleMap map) {
        if (openSpotsRadiusCircle == null) {
            final int circleRadius = getResources().getInteger(R.integer.defaultSearchRadius);
            CircleOptions circleOptions = new CircleOptions();
            circleOptions.center(latLng);
            circleOptions.radius(circleRadius); // radius of circle in meters
            circleOptions.strokeColor(getResources().getColor(R.color.searchRadius));
            circleOptions.strokeWidth(5f);
            openSpotsRadiusCircle = map.addCircle(circleOptions);
            circleOptions.strokeColor(getResources().getColor(R.color.sonar));
            circleOptions.strokeWidth(10f);
            openSpotsSonarCircle = map.addCircle(circleOptions);




            sonarAnim = new ValueAnimator();
            sonarAnim.setRepeatCount(ValueAnimator.INFINITE);
            sonarAnim.setRepeatMode(ValueAnimator.RESTART);  /* PULSE */
            sonarAnim.setIntValues(getResources().getInteger(R.integer.minSonarStart), circleRadius);
            sonarAnim.setDuration(getResources().getInteger(R.integer.sonarDuration));
            sonarAnim.setEvaluator(new IntEvaluator());
            sonarAnim.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                @Override
                public void onAnimationUpdate(ValueAnimator valueAnimator) {
                    openSpotsSonarCircle.setRadius((Integer) valueAnimator.getAnimatedValue());
                }

            });
            sonarAnim.start();
        } else {
            openSpotsRadiusCircle.setCenter(latLng);
            openSpotsSonarCircle.setCenter(latLng);
        }



    }

    public void setCenterOnLocationChange(boolean centerOnLocationChange) {
        this.centerOnLocationChange = centerOnLocationChange;
    }

    public boolean isCenterOnLocationChange() {
        return centerOnLocationChange;
    }
}
