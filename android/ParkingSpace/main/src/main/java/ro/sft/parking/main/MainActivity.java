package ro.sft.parking.main;

import android.content.ClipData;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.view.DragEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.*;
import android.view.Window;
import android.widget.Button;
import android.widget.EditText;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import ro.sft.parking.main.LayoutFragment.OnFragmentInteractionListener;
import ro.sft.parking.map.ParkingSpaceMapFragment;
import ro.sft.parking.parkingspace.main.R;
import ro.sft.parking.util.Util;


public class MainActivity extends FragmentActivity implements OnFragmentInteractionListener, ParkingSpaceMapFragment.OnFragmentInteractionListener {


    OnClickListener centerMapListener = new OnClickListener() {
        public boolean shown;

        @Override
        public void onClick(View v) {
            ParkingSpaceMapFragment map = (ParkingSpaceMapFragment) getFragmentManager().findFragmentById(R.id.map);

            map.centerMap();
            if (!shown) {
                Util.showToast(getResources().getString(R.string.long_tap_help), v.getContext());
                shown = true;
            }
        }
    };

    OnLongClickListener followMapCenterListener = new OnLongClickListener() {

        @Override
        public boolean onLongClick(View v) {
            ParkingSpaceMapFragment map = (ParkingSpaceMapFragment) getFragmentManager().findFragmentById(R.id.map);
            if (map.isCenterOnLocationChange()) {
                map.setCenterOnLocationChange(false);
                findViewById(R.id.centerButtonBar).setBackground(getResources().getDrawable(R.drawable.shape));
            } else {
                System.out.println("Enabling center on location");
                map.setCenterOnLocationChange(true);
                findViewById(R.id.centerButtonBar).setBackground(getResources().getDrawable(R.drawable.shape_selected));
                map.centerMap();
            }

            return true;
        }
    };
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
    View.OnClickListener increaseSearchRange = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            ParkingSpaceMapFragment map = (ParkingSpaceMapFragment) getFragmentManager().findFragmentById(R.id.map);
            EditText inputRadius = (EditText) findViewById(R.id.searchRadius);
            String text = inputRadius.getText().toString();
            int radius = Integer.parseInt(text);
            radius = radius + 50;
            int maxRadius = getResources().getInteger(R.integer.maxSearchRadius);
            if (radius <= maxRadius) {
                map.setSearchRange(radius);
                inputRadius.setText("" + radius);
            }
        }
    };
    View.OnClickListener decreaseSearchRange = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            ParkingSpaceMapFragment map = (ParkingSpaceMapFragment) getFragmentManager().findFragmentById(R.id.map);
            EditText inputRadius = (EditText) findViewById(R.id.searchRadius);
            String text = inputRadius.getText().toString();
            int radius = Integer.parseInt(text);
            radius = radius - 50;
            int minRadius = getResources().getInteger(R.integer.minSearchRadius);
            if (radius >= minRadius) {
                map.setSearchRange(radius);
                inputRadius.setText("" + radius);
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //Remove title bar
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_main);
        findViewById(R.id.new_spot_marker).setOnTouchListener(onTouchListener);
        findViewById(R.id.new_spot_marker).setOnDragListener(dragListener);
        findViewById(R.id.buttonPlus).setOnClickListener(increaseSearchRange);
        findViewById(R.id.buttonMinus).setOnClickListener(decreaseSearchRange);
        findViewById(R.id.centerMapButton).setOnClickListener(centerMapListener);
        findViewById(R.id.centerMapButton).setOnLongClickListener(followMapCenterListener);
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    public void onFragmentInteraction(Uri uri) {
        System.out.println("fragment interaction ");
    }

    @Override
    public void onCameraMove(CameraPosition cameraPosition) {
        System.out.println("Camera move ");
    }

    @Override
    public void onMapClick(LatLng clickPosition) {
        System.out.println("Map click");
    }


}
