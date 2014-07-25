package ro.sft.parking.main;

import android.content.ClipData;
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
import android.widget.EditText;
import android.widget.ImageView;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import ro.sft.parking.main.LayoutFragment.OnFragmentInteractionListener;
import ro.sft.parking.map.ParkingSpaceMapFragment;
import ro.sft.parking.parkingspace.main.R;
import ro.sft.parking.util.Anim;


public class MainActivity extends FragmentActivity implements OnFragmentInteractionListener, ParkingSpaceMapFragment.OnFragmentInteractionListener {


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


    View.OnClickListener showSearchRangeBar = new View.OnClickListener() {
        boolean isOpen;

        @Override
        public void onClick(View v) {
            View searchRangeBar = findViewById(R.id.searchRangeBar);
            View optionsHandle = findViewById(R.id.optionsHandle);
            int optionsHandleHeight = optionsHandle.getHeight();
            int searchRangeBarHeight = searchRangeBar.getHeight();

            if (!isOpen) {
                Anim.slideInBottom(searchRangeBar);
                Anim.slide(optionsHandle,   searchRangeBarHeight , 0);
                ((ImageView) optionsHandle).setImageResource(R.drawable.chevron_down);
            } else {
                Anim.slideOutBottom(searchRangeBar);
                Anim.slide(optionsHandle, 0, optionsHandleHeight);
                ((ImageView) optionsHandle).setImageResource(R.drawable.chevron_up);
            }

            isOpen = !isOpen;
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
        findViewById(R.id.optionsHandle).setOnClickListener(showSearchRangeBar);
        findViewById(R.id.buttonPlus).setOnClickListener(increaseSearchRange);
        findViewById(R.id.buttonMinus).setOnClickListener(decreaseSearchRange);
    }

    @Override
    protected void onStart() {
        super.onStart();
        findViewById(R.id.searchRangeBar).setVisibility(View.GONE);
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    @Override
    public void onMapMove(CameraPosition cameraPosition) {

        //slideOutSearchRangeBar();
    }

    @Override
    public void onMapClick(LatLng clickPosition) {
        //slideOutSearchRangeBar();
    }

}
