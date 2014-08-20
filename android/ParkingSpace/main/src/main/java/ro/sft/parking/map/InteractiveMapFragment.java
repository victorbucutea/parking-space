package ro.sft.parking.map;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.Settings;
import android.widget.Toast;
import com.google.android.gms.maps.GoogleMap.OnCameraChangeListener;
import com.google.android.gms.maps.GoogleMap.OnMapClickListener;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;

/**
 * Created by VictorBucutea on 22.07.2014.
 */
public class InteractiveMapFragment extends MapFragment implements LocationListener, OnCameraChangeListener, OnMapClickListener {

    protected Location mLocation;
    private OnFragmentInteractionListener mListener;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnFragmentInteractionListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString() + " must implement OnCustomFragmentInteractionListener");
        }
    }

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerForLocationUpdates();
    }

    @Override
    public void onStart() {
        super.onStart();
        getMap().setPadding(0, 0, 0, 135);
        registerForMapInteractions();
    }

    private void registerForMapInteractions() {
        getMap().setOnCameraChangeListener(this);
        getMap().setOnMapClickListener(this);
    }

    private void registerForLocationUpdates() {
        System.out.println("Creating location service ");

        final LocationManager manager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);

        if (!manager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            inviteUserToEnableGps();
        } else {
            System.out.println("GPS Provider is enabled");
        }

        if (!manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
            System.out.println("Network Provider is not enabled");
        } else {
            System.out.println("Network Provider is enabled");
        }
        manager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, this);
        manager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
    }

    private void inviteUserToEnableGps() {
        new AlertDialog.Builder(getActivity())
                .setMessage("GPS is switched off. enable?")
                .setPositiveButton("Enable GPS", new DialogInterface.OnClickListener() {

                    public void onClick(DialogInterface dialog, int which) {
                        Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        startActivityForResult(intent, 5);

                    }
                }).create().show();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        System.out.println("Activity result "+resultCode);
        final LocationManager manager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);

        if (manager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            Toast.makeText(getActivity(), "GPS is now enabled.", Toast.LENGTH_LONG).show();
        }
    }


    @Override
    public void onLocationChanged(Location location) {
        // override this to be notified of location changes
    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {
        System.out.println("Status Changed :" + provider);
    }

    @Override
    public void onProviderEnabled(String provider) {
        System.out.println("Provider enabled " + provider);
    }

    @Override
    public void onProviderDisabled(String provider) {
        System.out.println("Provider disabled " + provider);
    }

    @Override
    public void onCameraChange(CameraPosition cameraPosition) {
        mListener.onMapMove(cameraPosition);
    }

    @Override
    public void onMapClick(LatLng latLng) {
        mListener.onMapClick(latLng);
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        public void onMapMove(CameraPosition cameraPosition);

        public void onMapClick(LatLng clickPosition);
    }
}
