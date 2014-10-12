package ro.sft.parking.main;

import android.app.FragmentTransaction;
import android.content.ClipData;
import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.view.DragEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.DragShadowBuilder;
import android.view.View.OnDragListener;
import android.view.View.OnTouchListener;
import android.view.Window;
import android.widget.Toast;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import ro.sft.parking.main.LayoutFragment.OnFragmentInteractionListener;
import ro.sft.parking.parkingspace.main.R;


public class LocationActivity extends FragmentActivity implements
        GooglePlayServicesClient.ConnectionCallbacks,
        GooglePlayServicesClient.OnConnectionFailedListener,
        LocationListener, OnFragmentInteractionListener {


    private static final int MILLISECONDS_PER_SECOND = 1000;

    /**
     * Update frequency in seconds
     */
    private static final int UPDATE_INTERVAL_IN_SECONDS = 3;

    /**
     * Update frequency in milliseconds
     */
    private static final long UPDATE_INTERVAL = MILLISECONDS_PER_SECOND * UPDATE_INTERVAL_IN_SECONDS;

    View.OnDragListener dragListener = new OnDragListener() {
        public boolean onDrag(View v, DragEvent event) {
            int action = event.getAction();
            switch (action) {
                case DragEvent.ACTION_DRAG_STARTED:
                    System.out.println("Drag started");
                    break;
                case DragEvent.ACTION_DRAG_ENDED:
                    System.out.println("Drag ended");
                    break;

            }
            return true;
        }

    };
    View.OnTouchListener onTouchListener = new OnTouchListener() {
        public boolean onTouch(View view, MotionEvent motionEvent) {
            if (motionEvent.getAction() == MotionEvent.ACTION_DOWN) {
                ClipData data = ClipData.newPlainText("", "");
                DragShadowBuilder shadowBuilder = new View.DragShadowBuilder(view);
                view.startDrag(data, shadowBuilder, view, 0);
                view.setVisibility(View.INVISIBLE);
                return true;
            } else {
                return false;
            }
        }

    };
    View.OnClickListener showOptionsMenu = new View.OnClickListener() {

        LayoutFragment lf = new LayoutFragment();

        @Override
        public void onClick(View v) {
            System.out.println("Clicked button");
            FragmentTransaction ft = getFragmentManager().beginTransaction();
            ft.setCustomAnimations(R.animator.slide_in_left, R.animator.slide_out_right);

            if (!lf.isAdded()) {
                ft.add(R.id.mapLayout, lf);
                ft.addToBackStack(null);
                System.out.println("Showing options");
            } else {
                ft.hide(lf);
                ft.addToBackStack(null);
            }
            ft.commit();


            // registerReceiver(locationReceiver, new IntentFilter(LocationService.NEW_LOCATION));
            // unregisterReceiver(locationReceiver);

        }
    };

    private LocationClient mLocationClient;
    private LocationRequest mLocationRequest;
    private Location mLocation;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        System.out.println("Creating parent activity");
        super.onCreate(savedInstanceState);

        //Remove title bar
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        setContentView(R.layout.activity_main);
        findViewById(R.id.new_spot_marker).setOnTouchListener(onTouchListener);
        findViewById(R.id.new_spot_marker).setOnDragListener(dragListener);
        startLocationService();

    }

    private void startLocationService() {
        System.out.println("Creating location service ");

        final LocationManager manager = (LocationManager) getSystemService( Context.LOCATION_SERVICE );

        if ( !manager.isProviderEnabled( LocationManager.GPS_PROVIDER ) ) {
            System.out.println("GPS Provider is not enabled");
        } else {
            System.out.println("GPS Provider is  enabled");
        }

        if ( !manager.isProviderEnabled( LocationManager.NETWORK_PROVIDER) ) {
            System.out.println("Network Provider is not enabled");
        } else {
            System.out.println("Network Provider is  enabled");
        }

        mLocationClient = new LocationClient(this, this, this);
        mLocationRequest = LocationRequest.create();
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setInterval(UPDATE_INTERVAL);
        mLocationClient.connect();
    }

    @Override
    public void onLocationChanged(Location location) {
        Toast.makeText(this, "Location changed " + location.getLatitude() + " x " + location.getLongitude(), Toast.LENGTH_SHORT).show();
        mLocation = location;
    }


    @Override
    public void onConnected(Bundle bundle) {
        System.out.println("Connected to play services");
        Toast.makeText(this, "Connected to play services", Toast.LENGTH_SHORT).show();
        // If already requested, start periodic updates
        mLocationClient.requestLocationUpdates(mLocationRequest, this);
    }

    @Override
    public void onDisconnected() {
        System.out.println("Disconnected from play services");
        Toast.makeText(this, "Disconnected from play services", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        System.out.println("Connection failed to play services");
        Toast.makeText(this, "Connection failed to play services", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }

}
