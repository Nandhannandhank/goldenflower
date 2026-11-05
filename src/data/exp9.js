const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 9,
  title: 'Feedback Collector using Firestore',
  question: `Feedback Collector using Firestore
• Student name field.
• Feedback comment field.
• Submit button.
• Store submissions in Firestore collection named feedback.
• Include server timestamp.
• Display saved feedback in a scrollable list with real-time updates.`,
  gradle: [
    {
      name: 'build.gradle.kts (Project level)',
      code: `plugins {
    // ADD this line
    id("com.google.gms.google-services") version "4.4.2" apply false
}`,
    },
    {
      name: 'app/build.gradle.kts (Module level)',
      code: `plugins {
    // ADD this line
    id("com.google.gms.google-services")
}

dependencies {
    // ADD these lines
    implementation(platform("com.google.firebase:firebase-bom:33.5.1"))
    implementation("com.google.firebase:firebase-firestore")
}

// Also: download google-services.json from the Firebase console
// and place it inside the "app" folder.`,
    },
  ],
  manifest: `<manifest ...>

    <!-- ADD this line above <application> -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application ...>
        ...
    </application>
</manifest>`,
  files: [
    {
      name: 'MainActivity.kt',
      path: P,
      code: `package com.example.madlab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                FeedbackScreen()
            }
        }
    }
}

@Composable
fun FeedbackScreen() {
    val db = FirebaseFirestore.getInstance()
    var name by remember { mutableStateOf("") }
    var comment by remember { mutableStateOf("") }
    var list by remember { mutableStateOf(listOf<Pair<String, String>>()) }

    // Real-time listener: runs again automatically whenever the data changes
    DisposableEffect(Unit) {
        val listener = db.collection("feedback")
            .orderBy("time", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, _ ->
                list = snapshot?.documents?.map {
                    (it.getString("name") ?: "") to (it.getString("comment") ?: "")
                } ?: emptyList()
            }
        onDispose { listener.remove() }
    }

    Column(Modifier.statusBarsPadding().padding(16.dp)) {
        OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Student name") })
        OutlinedTextField(value = comment, onValueChange = { comment = it }, label = { Text("Feedback") })

        Button(onClick = {
            if (name.isNotBlank() && comment.isNotBlank()) {
                val data = hashMapOf(
                    "name" to name,
                    "comment" to comment,
                    "time" to FieldValue.serverTimestamp()
                )
                db.collection("feedback").add(data)
                name = ""
                comment = ""
            }
        }) {
            Text("Submit")
        }

        LazyColumn {
            items(list) { (n, c) ->
                Column(Modifier.padding(vertical = 8.dp)) {
                    Text(n, style = MaterialTheme.typography.titleMedium)
                    Text(c)
                }
            }
        }
    }
}
`,
    },
  ],
  explain: [
    'Firebase setup (once): create a project in Firebase console, add your Android app (package com.example.madlab), download google-services.json into the app folder, then Build > Firestore Database > Create database (Test mode).',
    'db.collection("feedback").add(data) saves one document in the collection named "feedback".',
    'FieldValue.serverTimestamp() makes the Firebase server write the time, not the phone.',
    'addSnapshotListener is the real-time part: whenever any feedback is added, the list updates by itself.',
    'orderBy("time", DESCENDING) shows the newest feedback first.',
    'DisposableEffect removes the listener (onDispose) when the screen closes.',
    'The list is shown in a scrollable LazyColumn.',
  ],
}
