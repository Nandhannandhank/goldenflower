const P = 'app/src/main/java/com/example/madlab/'

export default {
  id: 7,
  title: 'Reading List using Room and DataStore',
  question: `Reading List using Room and DataStore
• Store books with title and author using Room.
• Delete icon for each book.
• Switch between Title A-Z and Newest First.
• Save sorting preference with DataStore.
• Restore the preference when reopening the app.`,
  gradle: [
    {
      name: 'build.gradle.kts (Project level)',
      code: `plugins {
    // ADD this line (version must match your Kotlin version)
    id("com.google.devtools.ksp") version "2.0.21-1.0.28" apply false
}`,
    },
    {
      name: 'app/build.gradle.kts (Module level)',
      code: `plugins {
    // ADD this line
    id("com.google.devtools.ksp")
}

dependencies {
    // ADD these lines
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")
    implementation("androidx.datastore:datastore-preferences:1.1.1")
}`,
    },
  ],
  manifest: null,
  files: [
    {
      name: 'Book.kt',
      path: P,
      code: `package com.example.madlab

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity
data class Book(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val author: String
)
`,
    },
    {
      name: 'BookDao.kt',
      path: P,
      code: `package com.example.madlab

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface BookDao {
    @Query("SELECT * FROM Book ORDER BY title ASC")
    fun getByTitle(): Flow<List<Book>>

    @Query("SELECT * FROM Book ORDER BY id DESC")
    fun getNewest(): Flow<List<Book>>

    @Insert
    suspend fun insert(book: Book)

    @Delete
    suspend fun delete(book: Book)
}
`,
    },
    {
      name: 'AppDatabase.kt',
      path: P,
      code: `package com.example.madlab

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [Book::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {

    abstract fun bookDao(): BookDao

    companion object {
        private var instance: AppDatabase? = null

        fun get(context: Context): AppDatabase {
            if (instance == null) {
                instance = Room.databaseBuilder(
                    context.applicationContext, AppDatabase::class.java, "books.db"
                ).build()
            }
            return instance!!
        }
    }
}
`,
    },
    {
      name: 'SortStore.kt',
      path: P,
      code: `package com.example.madlab

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.preferencesDataStore

// DataStore file named "settings"
val Context.dataStore by preferencesDataStore(name = "settings")

// true = Newest First, false = Title A-Z
val SORT_KEY = booleanPreferencesKey("newest_first")
`,
    },
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
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                ReadingListScreen()
            }
        }
    }
}

@Composable
fun ReadingListScreen() {
    val context = LocalContext.current
    val dao = remember { AppDatabase.get(context).bookDao() }
    val scope = rememberCoroutineScope()

    // Read the saved sort preference from DataStore
    val prefs by context.dataStore.data.collectAsState(initial = emptyPreferences())
    val newestFirst = prefs[SORT_KEY] ?: false

    // Pick the Room query based on the preference
    val booksFlow = remember(newestFirst) {
        if (newestFirst) dao.getNewest() else dao.getByTitle()
    }
    val books by booksFlow.collectAsState(initial = emptyList())

    var title by remember { mutableStateOf("") }
    var author by remember { mutableStateOf("") }

    Column(Modifier.statusBarsPadding().padding(16.dp)) {
        OutlinedTextField(value = title, onValueChange = { title = it }, label = { Text("Title") })
        OutlinedTextField(value = author, onValueChange = { author = it }, label = { Text("Author") })

        Button(onClick = {
            if (title.isNotBlank()) {
                scope.launch { dao.insert(Book(title = title, author = author)) }
                title = ""
                author = ""
            }
        }) {
            Text("Add Book")
        }

        Row {
            Button(onClick = { scope.launch { context.dataStore.edit { it[SORT_KEY] = false } } }) {
                Text("Title A-Z")
            }
            Spacer(Modifier.width(8.dp))
            Button(onClick = { scope.launch { context.dataStore.edit { it[SORT_KEY] = true } } }) {
                Text("Newest First")
            }
        }

        LazyColumn {
            items(books) { book ->
                Row(
                    Modifier.fillMaxWidth().padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(book.title, style = MaterialTheme.typography.titleMedium)
                        Text(book.author)
                    }
                    IconButton(onClick = { scope.launch { dao.delete(book) } }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete")
                    }
                }
            }
        }
    }
}
`,
    },
  ],
  explain: [
    'Room has 3 parts: Entity (Book = the table), Dao (the queries) and Database (AppDatabase = the holder).',
    'Dao queries return Flow, so the list on screen updates automatically after every add or delete.',
    'getByTitle sorts A-Z (ORDER BY title). getNewest sorts by id DESC, because newer books get bigger ids.',
    'DataStore stores one true/false value: SORT_KEY (true = Newest First). It is saved on the phone, so it is restored when the app is reopened.',
    'booksFlow = remember(newestFirst) { ... } picks the matching query whenever the preference changes.',
    'IconButton with Icons.Default.Delete is the delete icon for every book.',
    'KSP (the plugin line) is needed so Room can generate its code. Its version must match your Kotlin version.',
    'Sync Gradle after editing the build files.',
  ],
}
